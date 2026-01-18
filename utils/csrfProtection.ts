/**
 * CSRF Protection Utility
 *
 * Provides explicit CSRF token validation for critical endpoints beyond NextAuth's built-in protection.
 * Use this for sensitive operations like payment processing, account changes, and admin actions.
 *
 * @module csrfProtection
 * @category Security
 */

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import crypto from "crypto";

/**
 * CSRF Token Store
 * In-memory storage for CSRF tokens with automatic cleanup
 * For production with multiple servers, replace with Redis/database
 */
class CSRFTokenStore {
  private tokens: Map<string, { token: string; expiresAt: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean expired tokens every 5 minutes
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Generate a new CSRF token for a user
   */
  generateToken(userId: string): string {
    const token = crypto.randomBytes(32).toString("base64url");
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour expiry

    this.tokens.set(userId, { token, expiresAt });
    return token;
  }

  /**
   * Validate a CSRF token for a user
   */
  validateToken(userId: string, token: string): boolean {
    const stored = this.tokens.get(userId);

    if (!stored) {
      return false;
    }

    if (Date.now() > stored.expiresAt) {
      this.tokens.delete(userId);
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(stored.token),
      Buffer.from(token),
    );

    if (isValid) {
      // Single-use token: delete after successful validation
      this.tokens.delete(userId);
    }

    return isValid;
  }

  /**
   * Remove expired tokens
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [userId, { expiresAt }] of this.tokens.entries()) {
      if (now > expiresAt) {
        this.tokens.delete(userId);
      }
    }
  }

  /**
   * Clear all tokens (for testing/shutdown)
   */
  clear(): void {
    this.tokens.clear();
  }

  /**
   * Get token count (for monitoring)
   */
  getSize(): number {
    return this.tokens.size;
  }

  /**
   * Stop cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Singleton instance
export const csrfTokenStore = new CSRFTokenStore();

/**
 * Generate CSRF token API endpoint handler
 *
 * @example
 * ```typescript
 * // app/api/csrf/route.ts
 * export async function GET(req: NextRequest) {
 *   return generateCSRFToken(req);
 * }
 * ```
 */
export async function generateCSRFToken(
  req: NextRequest,
): Promise<NextResponse> {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });

    if (!token || !token.id) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 },
      );
    }

    const csrfToken = csrfTokenStore.generateToken(token.id as string);

    return NextResponse.json({
      csrfToken,
      expiresIn: 3600, // 1 hour in seconds
    });
  } catch (error) {
    console.error("❌ [CSRF] Token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate CSRF token" },
      { status: 500 },
    );
  }
}

/**
 * Validate CSRF token from request
 *
 * @param req - Next.js request object
 * @returns True if valid, false otherwise
 */
export async function validateCSRFToken(req: NextRequest): Promise<boolean> {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });

    if (!token || !token.id) {
      return false;
    }

    // Check for CSRF token in headers
    const csrfToken =
      req.headers.get("x-csrf-token") || req.headers.get("csrf-token");

    if (!csrfToken) {
      console.warn("⚠️ [CSRF] Missing CSRF token in request");
      return false;
    }

    const isValid = csrfTokenStore.validateToken(token.id as string, csrfToken);

    if (!isValid) {
      console.warn("⚠️ [CSRF] Invalid or expired CSRF token");
    }

    return isValid;
  } catch (error) {
    console.error("❌ [CSRF] Token validation error:", error);
    return false;
  }
}

/**
 * CSRF Protection Middleware
 * Wraps API handlers with CSRF token validation
 *
 * @param handler - The API route handler
 * @param options - Configuration options
 * @returns Protected handler function
 *
 * @example
 * ```typescript
 * // app/api/payment/verify/route.ts
 * async function handler(req: NextRequest) {
 *   // Your payment logic
 * }
 *
 * export const POST = withCSRFProtection(handler);
 * ```
 */
export function withCSRFProtection(
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    methods?: string[];
    skipValidation?: boolean;
  } = {},
) {
  const {
    methods = ["POST", "PUT", "DELETE", "PATCH"],
    skipValidation = false,
  } = options;

  return async function protectedHandler(
    req: NextRequest,
  ): Promise<NextResponse> {
    // Skip CSRF validation for safe methods (GET, HEAD, OPTIONS)
    if (!methods.includes(req.method)) {
      return handler(req);
    }

    // Skip validation if explicitly disabled (for testing)
    if (skipValidation) {
      return handler(req);
    }

    // Validate CSRF token
    const isValid = await validateCSRFToken(req);

    if (!isValid) {
      return NextResponse.json(
        {
          error: "CSRF validation failed",
          message:
            "Invalid or missing CSRF token. Please refresh and try again.",
          code: "CSRF_VALIDATION_FAILED",
        },
        { status: 403 },
      );
    }

    // Token is valid, proceed with handler
    return handler(req);
  };
}

/**
 * Combined Rate Limit + CSRF Protection Middleware
 *
 * @param handler - The API route handler
 * @param rateLimitConfig - Rate limiting configuration
 * @returns Protected handler with both rate limiting and CSRF
 *
 * @example
 * ```typescript
 * import { paymentLimiter } from '@/utils/rateLimiter';
 *
 * async function handler(req: NextRequest) {
 *   // Payment verification logic
 * }
 *
 * export const POST = withRateLimitAndCSRF(handler, paymentLimiter);
 * ```
 */
export function withRateLimitAndCSRF(
  handler: (req: NextRequest) => Promise<NextResponse>,
  rateLimitConfig?: any,
) {
  // Import rate limiter dynamically to avoid circular dependencies
  let applyRateLimit: any;
  try {
    applyRateLimit = require("./rateLimitMiddleware").applyRateLimit;
  } catch (error) {
    console.warn("⚠️ [CSRF] Rate limiter not available, using CSRF only");
  }

  return async function combinedProtection(
    req: NextRequest,
  ): Promise<NextResponse> {
    // First, validate CSRF token
    const csrfProtected = withCSRFProtection(handler);

    // Then, apply rate limiting if available
    if (applyRateLimit && rateLimitConfig) {
      return applyRateLimit(req, rateLimitConfig, csrfProtected);
    }

    // CSRF protection only
    return csrfProtected(req);
  };
}

/**
 * Get CSRF token from NextAuth (for client-side use)
 * This uses NextAuth's built-in CSRF token mechanism
 *
 * @example
 * ```typescript
 * // Client-side
 * const { csrfToken } = await getCsrfToken();
 *
 * fetch('/api/sensitive-action', {
 *   method: 'POST',
 *   headers: {
 *     'Content-Type': 'application/json',
 *     'X-CSRF-Token': csrfToken,
 *   },
 *   body: JSON.stringify(data),
 * });
 * ```
 */
export async function getCSRFTokenForClient(
  req: NextRequest,
): Promise<string | null> {
  try {
    // NextAuth stores CSRF token in cookies
    const cookieName =
      process.env.NODE_ENV === "production"
        ? "__Host-next-auth.csrf-token"
        : "next-auth.csrf-token";

    const csrfCookie = req.cookies.get(cookieName);

    if (csrfCookie) {
      // NextAuth CSRF token format: "token|hash"
      const [token] = csrfCookie.value.split("|");
      return token;
    }

    return null;
  } catch (error) {
    console.error("❌ [CSRF] Error getting CSRF token:", error);
    return null;
  }
}

// Export store for testing/monitoring
export { CSRFTokenStore };
