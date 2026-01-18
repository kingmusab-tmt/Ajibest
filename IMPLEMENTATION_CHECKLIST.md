# Rate Limiting Implementation Checklist

## 📋 Complete Implementation Checklist

Use this checklist to track your progress implementing rate limiting across the application.

---

## Phase 1: CRITICAL - Authentication Endpoints (1-2 hours)

### 1.1 Login Endpoint

- [ ] Locate: `app/api/auth/[...nextauth]/route.ts` or custom login endpoint
- [ ] Import rate limiting: `import { withRateLimitAndLogging, authLimiter, resetRateLimit, getClientIP } from '@/utils/rateLimitMiddleware';`
- [ ] Wrap handler with `withRateLimitAndLogging`
- [ ] Add `resetRateLimit(clientIP)` on successful login
- [ ] Enable logging: `{ logRequests: true, resetOnSuccess: true }`
- [ ] Test: Make 6 login attempts, 5th should succeed, 6th should fail with 429
- [ ] Verify headers: Check for `X-RateLimit-*` headers
- [ ] Verify Retry-After header on 429 response

### 1.2 Registration/Signup Endpoint

- [ ] Locate: `app/api/users/createNewUser/route.ts`
- [ ] Import: `import { withRateLimit, strictAuthLimiter } from '@/utils/rateLimitMiddleware';`
- [ ] Wrap handler: `export const POST = withRateLimit(handler, strictAuthLimiter);`
- [ ] Test: Make 4 signup attempts, 4th should fail with 429
- [ ] Verify error message is appropriate
- [ ] Check logs for registration attempts

### 1.3 Password Reset Endpoint

- [ ] Locate: `app/api/forgot-password/route.ts` and `app/api/reset-password/route.ts`
- [ ] Import: `import { withRateLimit, strictAuthLimiter } from '@/utils/rateLimitMiddleware';`
- [ ] Wrap handler: `export const POST = withRateLimit(handler, strictAuthLimiter);`
- [ ] Test: Make 4 attempts, verify 429 on 4th
- [ ] Verify user sees appropriate retry message

### 1.4 Email Verification Endpoint

- [ ] Locate: `app/api/emailverify/route.ts` (if exists)
- [ ] Import: `import { withRateLimit, strictAuthLimiter } from '@/utils/rateLimitMiddleware';`
- [ ] Wrap handler: `export const POST = withRateLimit(handler, strictAuthLimiter);`
- [ ] Test rate limiting
- [ ] Verify verification still works

**Phase 1 Status**:

- [ ] All endpoints protected
- [ ] Testing completed
- [ ] Logs verified
- [ ] Ready for Phase 2

---

## Phase 2: CRITICAL - Payment Endpoints (30 minutes)

### 2.1 Transaction Verification Endpoint

- [ ] Locate: `app/api/verifyTransaction/route.ts`
- [ ] Import: `import { withRateLimit, paymentLimiter } from '@/utils/rateLimitMiddleware';`
- [ ] Import auth: `import { getServerSession } from 'next-auth';`
- [ ] Add authentication check:
  ```typescript
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  ```
- [ ] Wrap handler: `export const POST = withRateLimit(handler, paymentLimiter);`
- [ ] Test: Make 11 verification attempts, 11th should fail
- [ ] Verify payment verification still works correctly
- [ ] Check rate limit headers

### 2.2 Other Payment Endpoints (if any)

- [ ] Identify all payment-related endpoints
- [ ] Apply `paymentLimiter` to each
- [ ] Test each endpoint
- [ ] Verify payment processing still works

**Phase 2 Status**:

- [ ] Payment endpoints protected
- [ ] Authentication enforced
- [ ] Testing completed
- [ ] Ready for Phase 3

---

## Phase 3: HIGH - Email Endpoints (30 minutes)

### 3.1 Support Email Endpoint

- [ ] Locate: `app/api/sendSupportEmail/route.ts`
- [ ] Import: `import { withRateLimit, emailLimiter } from '@/utils/rateLimitMiddleware';`
- [ ] Wrap handler: `export const POST = withRateLimit(handler, emailLimiter);`
- [ ] Test: Send 6 support emails, 6th should fail with 429
- [ ] Verify email still sends successfully for allowed requests
- [ ] Check rate limit headers

### 3.2 Newsletter Subscription Endpoint

- [ ] Locate: `app/api/newsletter/route.ts` or newsletter signup
- [ ] Import: `import { withRateLimit, emailLimiter } from '@/utils/rateLimitMiddleware';`
- [ ] Wrap handler: `export const POST = withRateLimit(handler, emailLimiter);`
- [ ] Test: Make 6 newsletter signups from same IP, 6th should fail
- [ ] Verify subscription still works for allowed requests

### 3.3 Email Verification Endpoint (Resend)

- [ ] Locate: `app/api/emailverify/route.ts` (if has resend option)
- [ ] Import: `import { withRateLimit, emailLimiter } from '@/utils/rateLimitMiddleware';`
- [ ] Wrap handler: `export const POST = withRateLimit(handler, emailLimiter);`
- [ ] Test rate limiting
- [ ] Verify email verification still works

**Phase 3 Status**:

- [ ] Email endpoints protected
- [ ] Testing completed
- [ ] Ready for Phase 4

---

## Phase 4: HIGH - Search & Query Endpoints (1-2 hours)

### 4.1 Email Enumeration Fix (CRITICAL SECURITY)

- [ ] Locate: `app/api/users/searchbyemail/route.ts`
- [ ] Import auth: `import { getServerSession } from 'next-auth';`
- [ ] Add authentication requirement at start of handler:
  ```typescript
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  ```
- [ ] Import rate limiting: `import { withRateLimit, apiLimiter } from '@/utils/rateLimitMiddleware';`
- [ ] Wrap handler: `export const GET = withRateLimit(handler, apiLimiter);`
- [ ] Test: Unauthenticated request should return 401
- [ ] Test: Authenticated request should work
- [ ] Test: Make 101 requests, 101st should return 429
- [ ] Verify email enumeration is now prevented

### 4.2 Property Search Endpoint

- [ ] Locate: `app/api/properties/` search/filter endpoints
- [ ] Import: `import { withRateLimit, propertySearchLimiter } from '@/utils/rateLimitMiddleware';`
- [ ] Wrap handlers:
  ```typescript
  export const GET = withRateLimit(propertyHandler, propertySearchLimiter);
  ```
- [ ] Test: Make 31 searches in quick succession, 31st should fail
- [ ] Verify search results still return correctly
- [ ] Check rate limit headers

### 4.3 Other Search Endpoints

- [ ] Identify all search/filter endpoints
- [ ] Decide: Use `propertySearchLimiter` (30 req/min) or `apiLimiter` (100 req/15 min)
- [ ] Apply appropriate limiter
- [ ] Test each endpoint
- [ ] Verify search/filter functionality

### 4.4 User List/Query Endpoints

- [ ] Locate: `app/api/users/` GET endpoints
- [ ] Import: `import { withRateLimit, apiLimiter } from '@/utils/rateLimitMiddleware';`
- [ ] Wrap handlers: `export const GET = withRateLimit(handler, apiLimiter);`
- [ ] Test rate limiting
- [ ] Verify user data still returns correctly

**Phase 4 Status**:

- [ ] Email enumeration fixed ✅
- [ ] All search endpoints protected
- [ ] Testing completed
- [ ] Ready for Phase 5

---

## Phase 5: MEDIUM - Admin & Remaining Endpoints (2-3 hours)

### 5.1 Admin Endpoints - Dashboard

- [ ] Locate: `app/api/admin/` endpoints
- [ ] Decide: Use `apiLimiter` or stricter custom limiter?
- [ ] Create custom limiter for admin if needed:
  ```typescript
  const adminLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    maxRequests: 200, // Reasonable for admin
  });
  ```
- [ ] Import rate limiting
- [ ] Wrap all admin endpoints
- [ ] Test: Verify admin operations still work
- [ ] Test: Rate limiting works as expected

### 5.2 Admin Endpoints - Property Management

- [ ] Locate: `app/api/admin/manageProperty/` endpoints
- [ ] Apply rate limiting (consider `apiLimiter`)
- [ ] Test: Verify property management still works
- [ ] Test rate limiting

### 5.3 Admin Endpoints - User Management

- [ ] Locate: `app/api/admin/manageUser/` endpoints
- [ ] Apply rate limiting
- [ ] Test functionality and rate limiting

### 5.4 Admin Endpoints - Transactions

- [ ] Locate: `app/api/admin/manageTransactions/` endpoints
- [ ] Apply rate limiting
- [ ] Test functionality and rate limiting

### 5.5 Admin Endpoints - Payment Management

- [ ] Locate: `app/api/admin/managePayment/` endpoints
- [ ] Apply rate limiting (consider stricter: 50 req/hour)
- [ ] Test functionality and rate limiting

### 5.6 Remaining GET/POST Endpoints

- [ ] List all remaining unprotected endpoints:
  - [ ] `app/api/properties/*`
  - [ ] `app/api/property/*`
  - [ ] `app/api/propertyData/*`
  - [ ] `app/api/transactions/*`
  - [ ] `app/api/users/*` (except already done)
  - [ ] `app/api/notify/*`
  - [ ] Other endpoints...

- For each endpoint:
  - [ ] Import: `import { withRateLimit, apiLimiter } from '@/utils/rateLimitMiddleware';`
  - [ ] Wrap: `export const GET/POST = withRateLimit(handler, apiLimiter);`
  - [ ] Test: Verify functionality
  - [ ] Test: Verify rate limiting

**Phase 5 Status**:

- [ ] All admin endpoints protected
- [ ] All remaining endpoints protected
- [ ] Comprehensive testing completed
- [ ] Ready for production

---

## Testing & Validation

### Manual Testing

- [ ] Test each endpoint with curl/Postman
- [ ] Verify rate limit headers in responses
- [ ] Test rate limit reset on successful auth
- [ ] Verify 429 status code when limit exceeded
- [ ] Verify Retry-After header

### Automated Testing Script

```bash
#!/bin/bash
# Save as test-rate-limiting.sh and run

ENDPOINT="http://localhost:3000/api/endpoint"
LIMIT=100

for i in $(seq 1 $((LIMIT + 5))); do
  response=$(curl -s -w "\n%{http_code}" "$ENDPOINT")
  http_code=$(echo "$response" | tail -n 1)

  if [ $i -eq $LIMIT ]; then
    echo "Request $i (at limit): HTTP $http_code"
  elif [ $i -eq $((LIMIT + 1)) ]; then
    echo "Request $i (over limit): HTTP $http_code - Should be 429"
  fi
done
```

- [ ] Create and run testing script
- [ ] Verify expected behavior
- [ ] Check for any false positives

### Browser Console Testing

- [ ] Test from multiple browsers
- [ ] Check network tab for X-RateLimit headers
- [ ] Verify Retry-After header on 429
- [ ] Check console for any errors

### Production Simulation

- [ ] Use load testing tool (ApacheBench, wrk, etc.)
- [ ] Simulate burst traffic
- [ ] Verify rate limiting prevents overload
- [ ] Monitor server performance

**Testing Status**:

- [ ] Manual testing completed
- [ ] Automated script testing passed
- [ ] Browser testing verified
- [ ] Production simulation successful

---

## Monitoring & Logging

### Enable Logging

- [ ] Enable in all critical endpoints:
  ```typescript
  {
    logRequests: true;
  }
  ```
- [ ] Monitor console/logs for patterns

### Metrics to Track

- [ ] Number of rate limit hits per endpoint
- [ ] IP addresses being rate limited
- [ ] Time patterns of attacks
- [ ] False positive rate

### Production Monitoring

- [ ] Set up log aggregation (optional)
- [ ] Create alerts for excessive rate limiting
- [ ] Monitor CPU/memory for cleanup processes
- [ ] Track response times

**Monitoring Status**:

- [ ] Logging enabled
- [ ] Alerts configured
- [ ] Metrics baseline established

---

## Documentation

### For Developers

- [ ] Add code comments referencing rate limiting
- [ ] Document custom limits in endpoint code
- [ ] Add examples to API documentation

### For Users

- [ ] Document rate limits in API docs
- [ ] Explain Retry-After header
- [ ] Provide contact for rate limit increases

### Internal Documentation

- [ ] Document which endpoints use which limiters
- [ ] Document any custom limiters created
- [ ] Link to rate limiting documentation

**Documentation Status**:

- [ ] Developer comments added
- [ ] API documentation updated
- [ ] Internal docs complete

---

## Deployment Preparation

### Pre-Deployment Checklist

- [ ] All endpoints protected
- [ ] All testing passed
- [ ] Logging enabled
- [ ] Monitoring configured
- [ ] Team trained on new headers
- [ ] Rate limits documented

### Deployment Steps

- [ ] Deploy to staging environment
- [ ] Run full test suite on staging
- [ ] Verify rate limiting works
- [ ] Get approval from security team
- [ ] Deploy to production (recommend off-peak)
- [ ] Monitor production logs closely for first 24 hours

### Post-Deployment

- [ ] Monitor for false positives
- [ ] Collect metrics for 48 hours
- [ ] Review logs for any issues
- [ ] Adjust limits if needed
- [ ] Celebrate! 🎉

**Deployment Status**:

- [ ] Pre-deployment checklist complete
- [ ] Successfully deployed to staging
- [ ] Staged testing passed
- [ ] Deployed to production
- [ ] Post-deployment monitoring active

---

## Performance & Optimization (Optional)

### Monitor Performance

- [ ] Check cleanup process impact
- [ ] Monitor memory usage
- [ ] Check response time impact

### For High Traffic

- [ ] Consider Redis integration (see RATE_LIMITING_README.md)
- [ ] Implement distributed rate limiting
- [ ] Scale horizontally if needed

**Optimization Status**:

- [ ] Performance baseline established
- [ ] No performance issues observed
- [ ] Ready for optimization if needed

---

## Audit & Compliance

### Security Audit

- [ ] Verify all CRITICAL endpoints protected
- [ ] Verify all HIGH endpoints protected
- [ ] Verify authentication on sensitive endpoints
- [ ] Verify headers in responses
- [ ] Review logs for attack patterns

### Audit Report Alignment

- [ ] P1-1: No rate limiting → ✅ **FIXED**
- [ ] P1-3: Email enumeration → ✅ **FIXED**
- [ ] Email flooding risk → ✅ **FIXED**
- [ ] DDoS vulnerability → ✅ **FIXED**
- [ ] Brute force risk → ✅ **FIXED**
- [ ] Payment fraud risk → ✅ **FIXED**

**Compliance Status**:

- [ ] All critical issues addressed
- [ ] All high issues addressed
- [ ] Ready for security review

---

## Summary

### Overall Progress

- [ ] Phase 1 (Auth) - \_\_\_% Complete
- [ ] Phase 2 (Payments) - \_\_\_% Complete
- [ ] Phase 3 (Email) - \_\_\_% Complete
- [ ] Phase 4 (Search) - \_\_\_% Complete
- [ ] Phase 5 (Admin/Other) - \_\_\_% Complete

### Key Metrics

- Total endpoints protected: **_ / _**
- Critical endpoints: **_ / _**
- Testing coverage: \_\_\_%
- Zero-downtime deployment: ✅ Yes

### Final Status

- [ ] **✅ COMPLETE** - All endpoints protected, tested, and deployed

---

## Notes & Comments

Use this section to track any special circumstances or notes:

```
[Add notes here as you progress through implementation]

Example:
- Skipped endpoint X because it's deprecated
- Custom limiter created for admin operations
- False positive rate issue discovered on endpoint Y
- Performance impact minimal (< 2ms per request)
- Team training completed successfully
```

---

## Quick Links

- [RATE_LIMITING_README.md](RATE_LIMITING_README.md) - Full documentation
- [RATE_LIMITING_QUICK_REFERENCE.md](RATE_LIMITING_QUICK_REFERENCE.md) - Quick reference
- [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Implementation guide
- [EXAMPLE_LOGIN_WITH_RATE_LIMIT.ts](EXAMPLE_LOGIN_WITH_RATE_LIMIT.ts) - Auth example
- [EXAMPLE_PAYMENT_WITH_RATE_LIMIT.ts](EXAMPLE_PAYMENT_WITH_RATE_LIMIT.ts) - Payment example

---

**Created**: January 18, 2026  
**Purpose**: Track rate limiting implementation progress  
**Status**: Ready to use
