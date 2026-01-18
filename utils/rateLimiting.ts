/**
 * Rate Limiting Index & Export File
 *
 * Provides centralized exports for all rate limiting utilities
 * Import from here for convenience
 */

// Core rate limiter exports
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

// Middleware exports
export {
  applyRateLimit,
  withRateLimit,
  withRateLimitAndLogging,
  applyDifferentiatedRateLimit,
  withCompositeRateLimit,
} from "./rateLimitMiddleware";

/**
 * USAGE:
 *
 * // Option 1: Import from this index
 * import { apiLimiter, withRateLimit } from '@/utils/rateLimiting';
 *
 * // Option 2: Import from specific files (more explicit)
 * import { apiLimiter } from '@/utils/rateLimiter';
 * import { withRateLimit } from '@/utils/rateLimitMiddleware';
 *
 * Both are equivalent. Use whichever you prefer.
 */
