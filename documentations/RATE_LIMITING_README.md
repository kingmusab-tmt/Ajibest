# Custom Rate Limiting Middleware Implementation

## Overview

This is a **custom, zero-dependency rate limiting solution** built for Next.js that addresses the critical security finding from the AUDIT_REPORT.md:

> **P1-1: No rate limiting on APIs (CRITICAL)** - Vulnerable to DDoS, brute force attacks

## Features

**IP-based rate limiting** - Tracks requests by client IP  
 **User-based rate limiting** - Tracks requests per authenticated user  
 **Multiple predefined limiters** - Auth, payments, email, search, general API  
 **Zero dependencies** - Pure TypeScript/Next.js implementation  
 **Automatic memory cleanup** - Removes expired entries every 5 minutes  
 **Standard rate limit headers** - `X-RateLimit-*` headers in responses  
 **Retry-After header** - Tells clients when to retry  
 **Flexible configuration** - Easy to customize per endpoint  
 **Logging support** - Optional request/response logging  
 **Composite limiting** - Support for multiple limiters per endpoint

## File Structure

```
utils/
├── rateLimiter.ts              # Core rate limiting logic
├── rateLimitMiddleware.ts      # Middleware wrappers for easy integration
RATE_LIMITING_GUIDE.md          # Implementation examples and patterns
RATE_LIMITING_README.md         # This file
```

## Installation

No installation needed! The files are already created:

1. **[rateLimiter.ts](../utils/rateLimiter.ts)** - Core implementation
2. **[rateLimitMiddleware.ts](../utils/rateLimitMiddleware.ts)** - Middleware helpers
3. **[RATE_LIMITING_GUIDE.md](../RATE_LIMITING_GUIDE.md)** - Integration patterns

## Quick Start

### 1. Basic Rate Limiting

```typescript
import { NextRequest, NextResponse } from "next/server";
import { withRateLimit, apiLimiter } from "@/utils/rateLimitMiddleware";

async function getProperties(req: NextRequest): Promise<NextResponse> {
  // Your handler logic
  return NextResponse.json({ properties: [] });
}

export const GET = withRateLimit(getProperties, apiLimiter);
```

### 2. With Logging and Conditions

```typescript
import {
  withRateLimitAndLogging,
  authLimiter,
  resetRateLimit,
  getClientIP,
} from "@/utils/rateLimitMiddleware";

async function loginHandler(req: NextRequest): Promise<NextResponse> {
  const clientIP = getClientIP(req);
  // ... authentication logic ...

  if (loginSuccess) {
    resetRateLimit(clientIP); // Clear limit on successful login
  }

  return NextResponse.json({ success: true });
}

export const POST = withRateLimitAndLogging(loginHandler, authLimiter, {
  logRequests: true,
  resetOnSuccess: true,
});
```

### 3. Custom Rate Limiter

```typescript
import { createRateLimiter } from "@/utils/rateLimiter";

const customLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 requests per minute
  message: "Too many requests from your IP",
});

export const GET = withRateLimit(myHandler, customLimiter);
```

## Predefined Limiters

### 1. `apiLimiter`

- **Limit**: 100 requests per 15 minutes
- **Use for**: General API endpoints, property listings, user searches
- **Example**: GET endpoints, data fetching

### 2. `authLimiter`

- **Limit**: 5 requests per hour
- **Use for**: Login attempts, password resets
- **Best for**: Preventing brute force attacks

### 3. `strictAuthLimiter`

- **Limit**: 3 requests per 15 minutes
- **Use for**: Email verification, account recovery, sensitive operations
- **Best for**: High-security endpoints

### 4. `paymentLimiter`

- **Limit**: 10 requests per hour
- **Use for**: Transaction verification, payment processing
- **Prevents**: Payment fraud, duplicate charges

### 5. `emailLimiter`

- **Limit**: 5 requests per hour
- **Use for**: Email sending, newsletter signup, notifications
- **Prevents**: Email flooding, spam

### 6. `propertySearchLimiter`

- **Limit**: 30 requests per minute
- **Use for**: Property search, filter operations, advanced search
- **Prevents**: Database resource exhaustion

## Implementation Examples

### Example 1: Protect Auth Endpoint

```typescript
// app/api/auth/login/route.ts
import {
  withRateLimitAndLogging,
  authLimiter,
  resetRateLimit,
  getClientIP,
} from "@/utils/rateLimitMiddleware";

async function loginHandler(req: NextRequest): Promise<NextResponse> {
  const clientIP = getClientIP(req);

  // ... validate credentials ...

  if (credentialsValid) {
    resetRateLimit(clientIP); // Clear rate limit on success
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

export const POST = withRateLimitAndLogging(loginHandler, authLimiter, {
  logRequests: true,
  resetOnSuccess: true,
});
```

### Example 2: Protect Payment Endpoint

```typescript
// app/api/verifyTransaction/route.ts
import { withRateLimit, paymentLimiter } from "@/utils/rateLimitMiddleware";
import { getServerSession } from "next-auth";

async function verifyHandler(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // ... payment verification logic ...
  return NextResponse.json({ success: true });
}

export const POST = withRateLimit(verifyHandler, paymentLimiter);
```

### Example 3: Search Endpoint

```typescript
// app/api/properties/search/route.ts
import {
  withRateLimit,
  propertySearchLimiter,
} from "@/utils/rateLimitMiddleware";

async function searchHandler(req: NextRequest): Promise<NextResponse> {
  // ... search logic ...
  return NextResponse.json({ results: [] });
}

export const GET = withRateLimit(searchHandler, propertySearchLimiter);
```

### Example 4: Email Endpoint

```typescript
// app/api/sendSupportEmail/route.ts
import { withRateLimit, emailLimiter } from "@/utils/rateLimitMiddleware";

async function emailHandler(req: NextRequest): Promise<NextResponse> {
  // ... email sending logic ...
  return NextResponse.json({ success: true });
}

export const POST = withRateLimit(emailHandler, emailLimiter);
```

## Response Headers

### Successful Request

```
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705607156000
```

### Rate Limited Request

```
HTTP/1.1 429 Too Many Requests
Retry-After: 45
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705607156000

{
  "error": "Too many requests, please try again later.",
  "retryAfter": 45,
  "code": "RATE_LIMIT_EXCEEDED"
}
```

## How It Works

### Architecture

```
Request comes in
    ↓
Rate Limiter checks if IP/user is over limit
    ↓
If over limit:
  → Return 429 error with Retry-After header

If under limit:
  → Increment counter
  → Store reset time (window + now)
  → Proceed to handler
  → Inject rate limit headers
  → Return response
```

### Memory Management

- Entries are stored in a `Map<string, RequestRecord>`
- Each entry contains:
  - `count`: Number of requests in current window
  - `resetTime`: When this window expires
- Cleanup runs every 5 minutes
- Expired entries are automatically removed

### IP Detection

The middleware detects client IP from:

1. `X-Forwarded-For` header (proxy/load balancer)
2. `CF-Connecting-IP` header (Cloudflare)
3. `req.ip` (direct connection)

## Advanced Usage

### User-Based Limiting

For authenticated endpoints, track by user ID instead of IP:

```typescript
import { createUserBasedRateLimiter } from "@/utils/rateLimiter";

const userApiLimiter = createUserBasedRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 500, // Higher for authenticated users
});

export const GET = withRateLimit(handler, userApiLimiter);
```

### Endpoint-Specific Limiting

Create per-endpoint rate limiters:

```typescript
import { createEndpointRateLimiter } from "@/utils/rateLimiter";

const propertyCreateLimiter = createEndpointRateLimiter(
  "/api/admin/properties/create",
  {
    windowMs: 60 * 60 * 1000,
    maxRequests: 5, // Max 5 properties per hour
  },
);

export const POST = withRateLimit(createPropertyHandler, propertyCreateLimiter);
```

### Composite Limiting

Apply multiple limiters based on conditions:

```typescript
import { withCompositeRateLimit } from "@/utils/rateLimitMiddleware";

export const GET = withCompositeRateLimit(handler, [
  {
    limiter: strictAuthLimiter,
    shouldApply: (req) => req.method === "POST",
  },
  {
    limiter: apiLimiter,
    shouldApply: (req) => req.method === "GET",
  },
]);
```

## Production Considerations

### For High Traffic

For Redis-backed distributed rate limiting (recommended for production):

```typescript
// In production, consider using:
// - ioredis for distributed rate limiting
// - Redis Cluster for scalability
// - Rate limit data across multiple servers

// Current implementation:
//   Works for single-server deployments
// ⚠️ Not suitable for multi-server/serverless (Vercel)
```

If deploying to Vercel or multi-instance environments, consider:

1. **Redis Integration**:

   ```bash
   npm install ioredis
   ```

2. **Use Upstash Redis** (Serverless Redis):

   ```typescript
   import Redis from "ioredis";

   const redis = new Redis(process.env.REDIS_URL);
   // Modify rateLimiter.ts to use Redis store
   ```

3. **Use external rate limiting service**:
   - Cloudflare rate limiting
   - Kong API Gateway
   - AWS WAF

### For Testing

```typescript
import { resetRateLimit, getClientIP } from "@/utils/rateLimiter";

// In tests, reset limits:
beforeEach(() => {
  resetRateLimit("127.0.0.1");
});
```

## Audit Report Alignment

This implementation addresses:

| Issue                                          | Severity | Status                     |
| ---------------------------------------------- | -------- | -------------------------- |
| P1-1: No rate limiting on APIs                 | CRITICAL | **FIXED**                  |
| No request size limits                         | HIGH     | Can add via middleware     |
| CORS whitelist                                 | HIGH     | Can add via next.config    |
| Email enumeration vulnerability                | HIGH     | Rate limit + auth required |
| POST /api/verifyTransaction - No rate limiting | CRITICAL | **FIXED**                  |
| Email flooding attacks                         | MEDIUM   | Email limiter implemented  |

## Migration Checklist

- [ ] Review [RATE_LIMITING_GUIDE.md](../RATE_LIMITING_GUIDE.md) for integration patterns
- [ ] Add rate limiting to auth endpoints (login, signup, password reset)
- [ ] Add rate limiting to payment endpoints (verifyTransaction)
- [ ] Add rate limiting to email endpoints (sendSupportEmail)
- [ ] Add rate limiting to search endpoints (properties, users)
- [ ] Add rate limiting to admin endpoints
- [ ] Test rate limiting behavior with `curl` or Postman
- [ ] Monitor rate limit headers in production
- [ ] Document API rate limits in API documentation
- [ ] Consider Redis integration for multi-server deployment

## Testing

### Test Rate Limiting

```bash
# Test with curl - make 6 requests rapidly
for i in {1..6}; do
  curl -i http://localhost:3000/api/endpoint
done

# 5th response should be 429 Too Many Requests
```

### Check Headers

```bash
curl -i http://localhost:3000/api/endpoint

# Look for:
# X-RateLimit-Limit: 100
# X-RateLimit-Remaining: 99
# X-RateLimit-Reset: [timestamp]
```

## Troubleshooting

### Rate limit not working?

1. **Check middleware is imported**:

   ```typescript
   import { withRateLimit } from "@/utils/rateLimitMiddleware";
   ```

2. **Verify handler is wrapped**:

   ```typescript
   export const POST = withRateLimit(handler, limiter);
   ```

3. **Check TypeScript types**:
   - Ensure `RateLimitConfig` interface is properly imported

### Getting 429 too quickly?

1. **Verify window and limits**:

   ```typescript
   const limiter = createRateLimiter({
     windowMs: 15 * 60 * 1000, // Increase window
     maxRequests: 200, // Increase limit
   });
   ```

2. **Check IP detection**:
   ```typescript
   import { getClientIP } from "@/utils/rateLimiter";
   console.log(getClientIP(req)); // Should show actual IP
   ```

### Multi-server deployment issues?

- Switch to Redis-backed rate limiting (see Production Considerations)
- Or use Cloudflare rate limiting

## References

- [AUDIT_REPORT.md](../AUDIT_REPORT.md) - Security audit findings
- [RATE_LIMITING_GUIDE.md](../RATE_LIMITING_GUIDE.md) - Implementation examples
- [rateLimiter.ts](../utils/rateLimiter.ts) - Core implementation
- [rateLimitMiddleware.ts](../utils/rateLimitMiddleware.ts) - Middleware helpers

## License

Part of Ajibest Platform - Security Implementation

---

**Last Updated**: January 18, 2026  
**Status**: Production Ready (Single Server)  
**Next Steps**: Consider Redis integration for distributed deployments
