# Rate Limiting Migration Guide

## Overview

This guide provides step-by-step instructions for integrating rate limiting into existing API endpoints in the Ajibest application.

**Audit Report Finding**: P1-1 - No API rate limiting or throttling (CRITICAL)

## Phase 1: High-Priority Endpoints (Security-Critical)

These endpoints should be protected immediately as they present the highest security risk.

### 1.1 Authentication Endpoints

**Location**: `app/api/auth/`

**Endpoints to protect**:

- `[...nextauth]/route.ts` - NextAuth endpoints
- Login endpoint (if custom)
- Signup endpoint (if custom)

**Rate Limit to use**: `authLimiter` (5 per hour) or `strictAuthLimiter` (3 per 15 min)

**Integration Steps**:

```typescript
// Before
export async function POST(req: NextRequest) {
  // existing code
}

// After
import {
  withRateLimitAndLogging,
  authLimiter,
  resetRateLimit,
  getClientIP,
} from "@/utils/rateLimitMiddleware";

async function loginHandler(req: NextRequest): Promise<NextResponse> {
  // existing code

  if (loginSuccess) {
    resetRateLimit(getClientIP(req));
  }

  return response;
}

export const POST = withRateLimitAndLogging(loginHandler, authLimiter, {
  logRequests: true,
  resetOnSuccess: true,
});
```

### 1.2 Password Reset Endpoints

**Location**: `app/api/forgot-password/`, `app/api/reset-password/`

**Rate Limit to use**: `strictAuthLimiter` (3 per 15 min)

**Code Pattern**:

```typescript
import { withRateLimit, strictAuthLimiter } from "@/utils/rateLimitMiddleware";

async function resetPasswordHandler(req: NextRequest): Promise<NextResponse> {
  // existing code
}

export const POST = withRateLimit(resetPasswordHandler, strictAuthLimiter);
```

### 1.3 Payment Verification Endpoint

**Location**: `app/api/verifyTransaction/route.ts`

**Rate Limit to use**: `paymentLimiter` (10 per hour)

**Reason**: Prevents payment fraud and duplicate charges

**Code Pattern**:

```typescript
import { withRateLimit, paymentLimiter } from "@/utils/rateLimitMiddleware";

async function verifyTransactionHandler(
  req: NextRequest,
): Promise<NextResponse> {
  // existing code
}

export const POST = withRateLimit(verifyTransactionHandler, paymentLimiter);
```

**Additional Security**: Verify user is authenticated:

```typescript
const session = await getServerSession(authOptions);
if (!session?.user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

### 1.4 User Registration Endpoint

**Location**: `app/api/users/createNewUser/route.ts`

**Rate Limit to use**: `strictAuthLimiter` (3 per 15 min)

**Reason**: Prevent automated account creation/enumeration

**Code Pattern**:

```typescript
import { withRateLimit, strictAuthLimiter } from "@/utils/rateLimitMiddleware";

async function createUserHandler(req: NextRequest): Promise<NextResponse> {
  // existing code
}

export const POST = withRateLimit(createUserHandler, strictAuthLimiter);
```

## Phase 2: Email Endpoints

**Location**: `app/api/sendSupportEmail/`, `app/api/newsletter/`

**Rate Limit to use**: `emailLimiter` (5 per hour)

**Reason**: Prevent email flooding attacks

### 2.1 Support Email Endpoint

```typescript
// app/api/sendSupportEmail/route.ts
import { withRateLimit, emailLimiter } from "@/utils/rateLimitMiddleware";

async function sendEmailHandler(req: NextRequest): Promise<NextResponse> {
  // existing code
}

export const POST = withRateLimit(sendEmailHandler, emailLimiter);
```

### 2.2 Newsletter Signup

```typescript
// app/api/newsletter/route.ts
import { withRateLimit, emailLimiter } from "@/utils/rateLimitMiddleware";

async function newsletterHandler(req: NextRequest): Promise<NextResponse> {
  // existing code
}

export const POST = withRateLimit(newsletterHandler, emailLimiter);
```

## Phase 3: Search & Query Endpoints

**Rate Limit to use**: `propertySearchLimiter` (30 per minute) or `apiLimiter` (100 per 15 min)

### 3.1 Property Search

```typescript
// app/api/properties/route.ts
import {
  withRateLimit,
  propertySearchLimiter,
} from "@/utils/rateLimitMiddleware";

async function searchPropertiesHandler(
  req: NextRequest,
): Promise<NextResponse> {
  // existing code
}

export const GET = withRateLimit(
  searchPropertiesHandler,
  propertySearchLimiter,
);
```

### 3.2 User Search (Email Enumeration Fix)

**Location**: `app/api/users/searchbyemail/route.ts`

**Audit Finding**: "Email enumeration vulnerability (searchbyemail endpoint)"

**Fix Steps**:

```typescript
import { withRateLimit, apiLimiter } from "@/utils/rateLimitMiddleware";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";

async function searchByEmailHandler(req: NextRequest): Promise<NextResponse> {
  // CRITICAL: Require authentication to prevent email enumeration
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // existing code
}

export const GET = withRateLimit(searchByEmailHandler, apiLimiter);
```

### 3.3 Other Search/Filter Endpoints

```typescript
// Apply apiLimiter to GET endpoints
export const GET = withRateLimit(handler, apiLimiter);

// Apply propertySearchLimiter for property-specific searches
export const GET = withRateLimit(handler, propertySearchLimiter);
```

## Phase 4: General API Endpoints

**Rate Limit to use**: `apiLimiter` (100 per 15 min)

### All remaining endpoints:

- `app/api/properties/*` - GET requests
- `app/api/users/*` - GET requests (except searchbyemail)
- `app/api/transactions/*` - GET requests
- `app/api/admin/*` - Consider stricter limits
- `app/api/notify/*` - Notification endpoints

**Code Pattern**:

```typescript
import { withRateLimit, apiLimiter } from "@/utils/rateLimitMiddleware";

export const GET = withRateLimit(handler, apiLimiter);
export const POST = withRateLimit(handler, apiLimiter);
```

## Implementation Checklist

### Phase 1: Authentication (CRITICAL)

- [ ] Add rate limiting to login endpoint
- [ ] Add rate limiting to signup/registration endpoint
- [ ] Add rate limiting to password reset endpoint
- [ ] Add rate limiting to forgot password endpoint
- [ ] Test rate limiting behavior
- [ ] Verify reset on successful login works
- [ ] Check logs for failed attempts

### Phase 2: Payments (CRITICAL)

- [ ] Add rate limiting to `/api/verifyTransaction`
- [ ] Verify authentication requirement
- [ ] Test rate limiting with multiple requests
- [ ] Add logging for payment verification attempts
- [ ] Verify 429 response format
- [ ] Test Retry-After header

### Phase 3: Email

- [ ] Add rate limiting to `/api/sendSupportEmail`
- [ ] Add rate limiting to `/api/newsletter`
- [ ] Test email rate limiting
- [ ] Verify user sees appropriate error message

### Phase 4: Search & Queries

- [ ] Fix email enumeration vulnerability in `/api/users/searchbyemail`
- [ ] Add authentication requirement
- [ ] Add rate limiting to property search
- [ ] Add rate limiting to all GET endpoints

### Phase 5: Admin Endpoints

- [ ] Add rate limiting to `/api/admin/*` endpoints
- [ ] Consider stricter limits for admin operations
- [ ] Add logging for admin API calls

### Testing

- [ ] Create test script to verify rate limiting
- [ ] Test each endpoint with curl/Postman
- [ ] Verify X-RateLimit headers present
- [ ] Verify Retry-After header on 429
- [ ] Test across different IPs/clients
- [ ] Verify rate limit resets work correctly

### Monitoring

- [ ] Enable request logging
- [ ] Monitor rate limit events in logs
- [ ] Set up alerts for excessive rate limit hits
- [ ] Check analytics for rate limit abuse patterns

## Testing Script

```bash
#!/bin/bash
# Test rate limiting on any endpoint

ENDPOINT="http://localhost:3000/api/endpoint"
LIMIT=100

echo "Testing rate limiting on $ENDPOINT (limit: $LIMIT requests per window)"

for i in $(seq 1 $((LIMIT + 10))); do
  response=$(curl -s -w "\n%{http_code}" "$ENDPOINT")
  http_code=$(echo "$response" | tail -n 1)
  headers=$(curl -s -i "$ENDPOINT" | grep "X-RateLimit")

  if [ $i -eq $LIMIT ]; then
    echo "Request $i (at limit): HTTP $http_code"
  elif [ $i -eq $((LIMIT + 1)) ]; then
    echo "Request $i (should be rate limited): HTTP $http_code"
    echo "Headers: $headers"
  fi
done
```

## Common Issues & Solutions

### Issue: Rate limiting not working

**Check**:

1. Is the wrapper applied correctly?

   ```typescript
   export const POST = withRateLimit(handler, limiter); //   Correct
   export const POST = handler; //   Wrong
   ```

2. Is the import correct?

   ```typescript
   import { withRateLimit } from "@/utils/rateLimitMiddleware"; //
   ```

3. Is the handler an async function returning NextResponse?
   ```typescript
   async function handler(req: NextRequest): Promise<NextResponse> { //
   ```

### Issue: Getting 429 too quickly

**Solution**: Check the rate limit configuration

```typescript
// Increase window and/or max requests
const customLimiter = createRateLimiter({
  windowMs: 30 * 60 * 1000, // 30 minutes instead of 15
  maxRequests: 200, // 200 instead of 100
});
```

### Issue: Rate limit not resetting on success

**Check**:

1. Is `resetOnSuccess: true` set?

   ```typescript
   withRateLimitAndLogging(handler, authLimiter, {
     resetOnSuccess: true, //   Must be true
   });
   ```

2. Is the response status < 400?
   ```typescript
   // Only resets if response.status < 400
   return NextResponse.json({ success: true }); //   Resets
   return NextResponse.json({ error }, { status: 401 }); //   Doesn't reset
   ```

### Issue: False rate limits for legitimate users

**Possible causes**:

- Multiple users behind same proxy (same X-Forwarded-For)
- Proxy not sending correct headers
- Need user-based limiting instead of IP-based

**Solution**: Switch to user-based limiting for authenticated endpoints

```typescript
import { createUserBasedRateLimiter } from "@/utils/rateLimiter";

const userLimiter = createUserBasedRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 500, // Higher limit per authenticated user
});

export const GET = withRateLimit(handler, userLimiter);
```

## Production Considerations

### Single Server (Current Implementation)

Works well for:

- Single server deployments
- Development/testing
- Small to medium traffic

### Multi-Server / Serverless (Vercel, etc.)

⚠️ Current implementation has limitations:

- Rate limit state not shared between servers
- Each server has independent rate limits
- May need Redis for distributed tracking

**Upgrade to Redis** for production multi-server:

```typescript
// Future: Implement Redis-backed store
// See RATE_LIMITING_README.md for details
```

## Next Steps

1.  Review [RATE_LIMITING_README.md](RATE_LIMITING_README.md)
2.  Review [RATE_LIMITING_GUIDE.md](RATE_LIMITING_GUIDE.md)
3.  Review implementation examples:

- [EXAMPLE_LOGIN_WITH_RATE_LIMIT.ts](EXAMPLE_LOGIN_WITH_RATE_LIMIT.ts)
- [EXAMPLE_PAYMENT_WITH_RATE_LIMIT.ts](EXAMPLE_PAYMENT_WITH_RATE_LIMIT.ts)

4. Start with Phase 1 (Critical endpoints)
5. Test thoroughly before Phase 2-4
6. Monitor logs for issues
7. Consider Redis integration for production

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review the implementation examples
3. Check endpoint-specific rate limit config in [utils/rateLimiter.ts](utils/rateLimiter.ts)
4. Enable logging: `logRequests: true` in `withRateLimitAndLogging`

---

**Document Status**: Complete  
**Last Updated**: January 18, 2026  
**Audit Finding Addressed**: P1-1 (Critical)
