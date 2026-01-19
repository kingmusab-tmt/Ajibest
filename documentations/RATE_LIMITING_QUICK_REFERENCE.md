# Rate Limiting Quick Reference Card

## 📋 Predefined Limiters

| Limiter                 | Limit         | Best For                    | Import |
| ----------------------- | ------------- | --------------------------- | ------ |
| `apiLimiter`            | 100 req/15min | General API endpoints       |        |
| `authLimiter`           | 5 req/hour    | Login, password reset       |        |
| `strictAuthLimiter`     | 3 req/15min   | Registration, sensitive ops |        |
| `paymentLimiter`        | 10 req/hour   | Payment verification        |        |
| `emailLimiter`          | 5 req/hour    | Email sending               |        |
| `propertySearchLimiter` | 30 req/min    | Property search             |        |

## 🚀 Quick Integration (3 Steps)

### Step 1: Import

```typescript
import { withRateLimit, apiLimiter } from "@/utils/rateLimitMiddleware";
```

### Step 2: Wrap Handler

```typescript
async function myHandler(req: NextRequest): Promise<NextResponse> {
  // Your existing code
  return NextResponse.json({ data: [] });
}
```

### Step 3: Export with Rate Limit

```typescript
export const GET = withRateLimit(myHandler, apiLimiter);
```

## 🔒 Authentication Endpoints

```typescript
import {
  withRateLimitAndLogging,
  authLimiter,
  resetRateLimit,
  getClientIP,
} from "@/utils/rateLimitMiddleware";

async function loginHandler(req: NextRequest): Promise<NextResponse> {
  const clientIP = getClientIP(req);
  // ... login logic ...
  if (success) resetRateLimit(clientIP);
  return NextResponse.json({ success: true });
}

export const POST = withRateLimitAndLogging(loginHandler, authLimiter, {
  logRequests: true,
  resetOnSuccess: true,
});
```

## 💳 Payment Endpoints

```typescript
import { withRateLimit, paymentLimiter } from "@/utils/rateLimitMiddleware";
import { getServerSession } from "next-auth";

async function paymentHandler(req: NextRequest): Promise<NextResponse> {
  // Require authentication
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Your payment logic
  return NextResponse.json({ success: true });
}

export const POST = withRateLimit(paymentHandler, paymentLimiter);
```

## 📧 Email Endpoints

```typescript
import { withRateLimit, emailLimiter } from "@/utils/rateLimitMiddleware";

async function emailHandler(req: NextRequest): Promise<NextResponse> {
  // Your email sending logic
  return NextResponse.json({ success: true });
}

export const POST = withRateLimit(emailHandler, emailLimiter);
```

## 🔍 Search Endpoints

```typescript
import {
  withRateLimit,
  propertySearchLimiter,
} from "@/utils/rateLimitMiddleware";

async function searchHandler(req: NextRequest): Promise<NextResponse> {
  // Your search logic
  return NextResponse.json({ results: [] });
}

export const GET = withRateLimit(searchHandler, propertySearchLimiter);
```

## 🛠️ Custom Rate Limiter

```typescript
import { createRateLimiter } from "@/utils/rateLimiter";

const customLimiter = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 20, // 20 requests
  message: "Too many requests",
});

export const POST = withRateLimit(myHandler, customLimiter);
```

## 👤 User-Based Limiting

```typescript
import { createUserBasedRateLimiter } from "@/utils/rateLimiter";

const userLimiter = createUserBasedRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 500, // Higher for authenticated users
});

export const GET = withRateLimit(handler, userLimiter);
```

## 📍 Endpoint-Specific Limiting

```typescript
import { createEndpointRateLimiter } from "@/utils/rateLimiter";

const propertyCreateLimiter = createEndpointRateLimiter(
  "/api/admin/properties/create",
  { windowMs: 60 * 60 * 1000, maxRequests: 5 },
);

export const POST = withRateLimit(handler, propertyCreateLimiter);
```

## 📊 Response Headers

### Success (200, 201, etc.)

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705607156000
```

### Rate Limited (429)

```
HTTP/1.1 429 Too Many Requests
Retry-After: 45
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1705607156000

{
  "error": "Too many requests, please try again later.",
  "retryAfter": 45,
  "code": "RATE_LIMIT_EXCEEDED"
}
```

## 🧪 Test Rate Limiting

```bash
# Make 6 requests with 100/15min limit (5th should fail)
for i in {1..6}; do
  echo "Request $i:"
  curl -i http://localhost:3000/api/endpoint | grep -E "HTTP|X-RateLimit"
done

# Check headers
curl -i http://localhost:3000/api/endpoint | grep "X-RateLimit"
```

## Common Mistakes

```typescript
//   Wrong: Not wrapping handler
export const POST = myHandler;

//   Right: Wrapping handler with rate limiter
export const POST = withRateLimit(myHandler, apiLimiter);

//   Wrong: Importing wrong function
import { apiLimiter } from "@/utils/rateLimiter"; // Can import, but use middleware

//   Right: Full imports
import { withRateLimit, apiLimiter } from "@/utils/rateLimitMiddleware";

//   Wrong: Not async function returning NextResponse
export const POST = async (req) => {};

//   Right: Async function returning NextResponse
async function handler(req: NextRequest): Promise<NextResponse> {}
export const POST = withRateLimit(handler, apiLimiter);
```

## 📁 Files Reference

- **Implementation**: [utils/rateLimiter.ts](utils/rateLimiter.ts)
- **Middleware**: [utils/rateLimitMiddleware.ts](utils/rateLimitMiddleware.ts)
- **Guide**: [RATE_LIMITING_GUIDE.md](RATE_LIMITING_GUIDE.md)
- **README**: [RATE_LIMITING_README.md](RATE_LIMITING_README.md)
- **Migration**: [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)
- **Examples**:
  - [EXAMPLE_LOGIN_WITH_RATE_LIMIT.ts](EXAMPLE_LOGIN_WITH_RATE_LIMIT.ts)
  - [EXAMPLE_PAYMENT_WITH_RATE_LIMIT.ts](EXAMPLE_PAYMENT_WITH_RATE_LIMIT.ts)

## 🔗 Related Audit Items

Fixes these critical issues:

- P1-1: No rate limiting on APIs (CRITICAL)
- P1-3: Email enumeration vulnerability (HIGH)
- Vulnerable endpoint: POST /api/verifyTransaction
- Email flooding attack prevention

## 💡 Pro Tips

1. **Always use `resetOnSuccess: true` for auth**:

   ```typescript
   withRateLimitAndLogging(handler, authLimiter, { resetOnSuccess: true });
   ```

2. **Add authentication check for payment endpoints**:

   ```typescript
   const session = await getServerSession(authOptions);
   if (!session)
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   ```

3. **Use logging for security-sensitive endpoints**:

   ```typescript
   {
     logRequests: true;
   } // See all attempts in console
   ```

4. **Higher limits for authenticated users**:

   ```typescript
   createUserBasedRateLimiter({
     windowMs: 15 * 60 * 1000,
     maxRequests: 500, // vs 100 for IP-based
   });
   ```

5. **Different limits for different methods**:
   ```typescript
   export const GET = withRateLimit(handler, apiLimiter);
   export const POST = withRateLimit(handler, strictAuthLimiter);
   ```

## 📞 Need Help?

1. See [RATE_LIMITING_README.md](RATE_LIMITING_README.md) - Comprehensive guide
2. See [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) - Step-by-step integration
3. Check examples in [EXAMPLE\_\*.ts](EXAMPLE_LOGIN_WITH_RATE_LIMIT.ts) files
4. Enable logging: `logRequests: true`

---

**Shortcut**: Bookmark this page! It has everything you need for quick implementation.
