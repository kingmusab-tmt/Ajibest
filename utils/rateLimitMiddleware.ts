/**
 * Rate Limiting Middleware Wrapper
 * Provides easy integration with Next.js API routes
 * Handles both successful and failed requests
 */

import { NextRequest, NextResponse } from "next/server";
import {
  createRateLimiter,
  addRateLimitHeaders,
  resetRateLimit,
  getClientIP,
  apiLimiter,
  authLimiter,
  strictAuthLimiter,
  paymentLimiter,
  emailLimiter,
  propertySearchLimiter,
  type RateLimitConfig,
} from "./rateLimiter";

/**
 * Middleware to apply rate limiting to API routes
 * Usage in route.ts:
 *
 * export async function POST(req: NextRequest) {
 *   const response = await applyRateLimit(req, apiLimiter);
 *   if (response) return response; // Rate limit exceeded
 *
 *   // Your route logic here
 * }
 */
export async function applyRateLimit(
  req: NextRequest,
  rateLimiter: (req: NextRequest) => Promise<NextResponse | null>,
): Promise<NextResponse | null> {
  return await rateLimiter(req);
}

/**
 * Wrapper to apply rate limiting to route handler
 * Usage example:
 * export const POST = withRateLimit(yourHandler, apiLimiter);
 */
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  rateLimiter: (req: NextRequest) => Promise<NextResponse | null>,
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Check rate limit
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Proceed with handler
    const response = await handler(req);

    // Add rate limit headers to response
    return addRateLimitHeaders(response, req);
  };
}

/**
 * Advanced wrapper with logging and conditional rate limiting
 */
export function withRateLimitAndLogging(
  handler: (req: NextRequest) => Promise<NextResponse>,
  rateLimiter: (req: NextRequest) => Promise<NextResponse | null>,
  options?: {
    logRequests?: boolean;
    resetOnSuccess?: boolean;
    resetOnFailure?: boolean;
  },
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const clientIP = getClientIP(req);
    const startTime = Date.now();

    // Check rate limit
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) {
      if (options?.logRequests) {
        console.warn(
          `[RateLimit] ${clientIP} - ${req.method} ${req.nextUrl.pathname} - Rate limited`,
        );
      }
      return rateLimitResponse;
    }

    try {
      // Proceed with handler
      const response = await handler(req);

      // Reset rate limit on successful request if configured
      if (options?.resetOnSuccess && response.status < 400) {
        resetRateLimit(clientIP);
      }

      if (options?.logRequests) {
        const duration = Date.now() - startTime;
        console.log(
          `[API] ${clientIP} - ${req.method} ${req.nextUrl.pathname} - ${response.status} (${duration}ms)`,
        );
      }

      // Add rate limit headers
      return addRateLimitHeaders(response, req);
    } catch (error) {
      if (options?.logRequests) {
        console.error(
          `[Error] ${clientIP} - ${req.method} ${req.nextUrl.pathname}`,
          error instanceof Error ? error.message : "Unknown error",
        );
      }

      // Reset rate limit on error if configured
      if (options?.resetOnFailure) {
        resetRateLimit(clientIP);
      }

      throw error;
    }
  };
}

/**
 * Differentiated rate limiting based on authentication status
 * Allows higher rate limits for authenticated users
 */
export async function applyDifferentiatedRateLimit(
  req: NextRequest,
  options: {
    authenticatedLimiter: (req: NextRequest) => Promise<NextResponse | null>;
    unauthenticatedLimiter: (req: NextRequest) => Promise<NextResponse | null>;
    isAuthenticated: boolean;
  },
): Promise<NextResponse | null> {
  const limiter = options.isAuthenticated
    ? options.authenticatedLimiter
    : options.unauthenticatedLimiter;

  return await limiter(req);
}

/**
 * Composite rate limiting for multiple conditions
 */
export function withCompositeRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  limiters: Array<{
    limiter: (req: NextRequest) => Promise<NextResponse | null>;
    shouldApply: (req: NextRequest) => boolean;
  }>,
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Check all applicable rate limiters
    for (const { limiter, shouldApply } of limiters) {
      if (shouldApply(req)) {
        const rateLimitResponse = await limiter(req);
        if (rateLimitResponse) {
          return rateLimitResponse;
        }
      }
    }

    // Proceed with handler
    const response = await handler(req);
    return addRateLimitHeaders(response, req);
  };
}

// Re-export all utilities for convenience
export {
  createRateLimiter,
  getClientIP,
  apiLimiter,
  authLimiter,
  strictAuthLimiter,
  paymentLimiter,
  emailLimiter,
  propertySearchLimiter,
  addRateLimitHeaders,
  resetRateLimit,
  createUserBasedRateLimiter,
  createEndpointRateLimiter,
  type RateLimitConfig,
} from "./rateLimiter";
