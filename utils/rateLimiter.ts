/**
 * Custom Rate Limiting Middleware for Next.js
 * Implements IP-based and user-based rate limiting
 * Addresses AUDIT_REPORT.md critical issue: "No API rate limiting or throttling"
 */

import { NextRequest, NextResponse } from "next/server";

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
  statusCode?: number;
  keyGenerator?: (req: NextRequest) => string; // Function to generate rate limit key
}

interface RequestRecord {
  count: number;
  resetTime: number;
}

// In-memory store for tracking requests
// For production, consider using Redis for distributed rate limiting
class RateLimitStore {
  private store: Map<string, RequestRecord> = new Map();

  constructor() {
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (record.resetTime < now) {
        this.store.delete(key);
      }
    }
  }

  isLimited(key: string, windowMs: number, maxRequests: number): boolean {
    const now = Date.now();
    const record = this.store.get(key);

    // First request or window has expired
    if (!record || record.resetTime < now) {
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return false;
    }

    // Increment counter
    record.count++;

    // Check if limit exceeded
    return record.count > maxRequests;
  }

  getRemainingRequests(key: string, maxRequests: number): number {
    const record = this.store.get(key);
    if (!record) return maxRequests;
    return Math.max(0, maxRequests - record.count);
  }

  getResetTime(key: string): number {
    const record = this.store.get(key);
    return record?.resetTime || Date.now();
  }

  reset(key: string): void {
    this.store.delete(key);
  }
}

// Global rate limit store instance
const globalStore = new RateLimitStore();

/**
 * Extract client IP from request headers
 * Handles proxied requests (X-Forwarded-For, CF-Connecting-IP)
 */
export function getClientIP(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const cfIP = req.headers.get("cf-connecting-ip");
  if (cfIP) return cfIP;

  // Fallback: extract from socket if available, otherwise unknown
  return "unknown";
}

/**
 * Create rate limiter middleware
 */
export function createRateLimiter(config: RateLimitConfig) {
  const defaultConfig: Required<RateLimitConfig> = {
    windowMs: config.windowMs,
    maxRequests: config.maxRequests,
    message: config.message || "Too many requests, please try again later.",
    statusCode: config.statusCode || 429,
    keyGenerator: config.keyGenerator || ((req) => getClientIP(req)),
  };

  return async (req: NextRequest): Promise<NextResponse | null> => {
    const key = defaultConfig.keyGenerator(req);
    const isLimited = globalStore.isLimited(
      key,
      defaultConfig.windowMs,
      defaultConfig.maxRequests,
    );

    if (isLimited) {
      const resetTime = globalStore.getResetTime(key);
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);

      return new NextResponse(
        JSON.stringify({
          error: defaultConfig.message,
          retryAfter,
          code: "RATE_LIMIT_EXCEEDED",
        }),
        {
          status: defaultConfig.statusCode,
          headers: {
            "Retry-After": retryAfter.toString(),
            "X-RateLimit-Limit": defaultConfig.maxRequests.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": resetTime.toString(),
          },
        },
      );
    }

    // Add rate limit info to headers for successful requests
    const remaining = globalStore.getRemainingRequests(
      key,
      defaultConfig.maxRequests,
    );
    const resetTime = globalStore.getResetTime(key);

    // Store rate limit info for response header injection
    (req as any)._rateLimitInfo = {
      limit: defaultConfig.maxRequests,
      remaining,
      reset: resetTime,
    };

    return null; // No error, proceed to next middleware/handler
  };
}

/**
 * Predefined rate limiters for common use cases
 */

// General API rate limiter: 100 requests per 15 minutes
export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
  message: "Too many API requests, please try again later.",
});

// Auth rate limiter: 5 failed attempts per hour (if login fails)
export const authLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
  message: "Too many login attempts, please try again later.",
});

// Strict auth limiter: 3 attempts per 15 minutes for sensitive operations
export const strictAuthLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 3,
  message: "Too many authentication attempts, please try again later.",
});

// Payment limiter: 10 transactions per hour
export const paymentLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 10,
  message: "Too many payment requests, please try again later.",
});

// Email limiter: 5 emails per hour to prevent email flooding
export const emailLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  maxRequests: 5,
  message: "Too many email requests, please try again later.",
});

// Property search limiter: 30 searches per minute
export const propertySearchLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  message: "Too many search requests, please try again later.",
});

/**
 * Middleware helper to add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  req: NextRequest,
): NextResponse {
  const rateLimitInfo = (req as any)._rateLimitInfo;

  if (rateLimitInfo) {
    response.headers.set("X-RateLimit-Limit", rateLimitInfo.limit.toString());
    response.headers.set(
      "X-RateLimit-Remaining",
      rateLimitInfo.remaining.toString(),
    );
    response.headers.set("X-RateLimit-Reset", rateLimitInfo.reset.toString());
  }

  return response;
}

/**
 * Utility to reset rate limit for a specific key (e.g., after successful login)
 */
export function resetRateLimit(key: string): void {
  globalStore.reset(key);
}

/**
 * Create a user-based rate limiter (requires session/user ID)
 * Useful for authenticated endpoints where you want to rate limit per user
 */
export function createUserBasedRateLimiter(
  config: Omit<RateLimitConfig, "keyGenerator">,
) {
  return createRateLimiter({
    ...config,
    keyGenerator: (req) => {
      // Extract user ID from session or bearer token if available
      const authHeader = req.headers.get("Authorization");
      const sessionCookie = req.headers.get("Cookie");

      // Try to extract user ID from session
      if (sessionCookie) {
        try {
          // This is a simplified approach - in production, validate the session properly
          const userId = sessionCookie.match(/userId=([^;]+)/)?.[1];
          if (userId) return `user:${userId}`;
        } catch {
          // Fallback to IP-based
        }
      }

      return getClientIP(req);
    },
  });
}

/**
 * Per-endpoint rate limiter: Combine IP and endpoint for granular control
 */
export function createEndpointRateLimiter(
  endpoint: string,
  config: Omit<RateLimitConfig, "keyGenerator">,
) {
  return createRateLimiter({
    ...config,
    keyGenerator: (req) => `${endpoint}:${getClientIP(req)}`,
  });
}
