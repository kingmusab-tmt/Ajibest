# CSRF Protection Quick Reference

## 🚀 Quick Start

### 1. Protect an API Endpoint (CSRF Only)

```typescript
// app/api/your-endpoint/route.ts
import { withCSRFProtection } from "@/utils/csrfProtection";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: NextRequest) {
  const body = await req.json();
  // Your logic here
  return NextResponse.json({ success: true });
}

export const POST = withCSRFProtection(handler);
```

### 2. Protect with Rate Limiting + CSRF (Recommended)

```typescript
// app/api/payment/verify/route.ts
import { withRateLimitAndCSRF } from "@/utils/csrfProtection";
import { paymentLimiter } from "@/utils/rateLimiter";

async function handler(req: NextRequest) {
  // Payment verification logic
  return NextResponse.json({ success: true });
}

export const POST = withRateLimitAndCSRF(handler, paymentLimiter);
```

### 3. Client-Side: Get CSRF Token

```typescript
import { getCsrfToken } from "next-auth/react";

async function submitForm() {
  const csrfToken = await getCsrfToken();

  const response = await fetch("/api/your-endpoint", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken || "",
    },
    body: JSON.stringify(data),
  });
}
```

### 4. React Component Example

```typescript
"use client";

import { getCsrfToken } from "next-auth/react";
import { useState, useEffect } from "react";

export default function PaymentForm() {
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    getCsrfToken().then(token => setCsrfToken(token || ""));
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/payment/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
      body: JSON.stringify(formData),
    });

    if (response.status === 403) {
      alert('CSRF validation failed - please refresh and try again');
      return;
    }

    const data = await response.json();
    // Handle success
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

---

## 📦 Available Limiters

Use these with `withRateLimitAndCSRF`:

| Limiter                 | Limit     | Use Case                       |
| ----------------------- | --------- | ------------------------------ |
| `apiLimiter`            | 100/15min | General API calls              |
| `authLimiter`           | 5/hour    | Login, signup                  |
| `strictAuthLimiter`     | 3/15min   | Password change, admin actions |
| `paymentLimiter`        | 10/hour   | Payment processing             |
| `emailLimiter`          | 5/hour    | Email sending                  |
| `propertySearchLimiter` | 30/min    | Search operations              |

```typescript
import {
  apiLimiter,
  authLimiter,
  strictAuthLimiter,
  paymentLimiter,
  emailLimiter,
  propertySearchLimiter,
} from "@/utils/rateLimiter";
```

---

## 🎯 Common Patterns

### Pattern 1: Payment Endpoint

```typescript
import { withRateLimitAndCSRF } from "@/utils/csrfProtection";
import { paymentLimiter } from "@/utils/rateLimiter";

export const POST = withRateLimitAndCSRF(handler, paymentLimiter);
```

### Pattern 2: Admin Endpoint

```typescript
import { withRateLimitAndCSRF } from "@/utils/csrfProtection";
import { strictAuthLimiter } from "@/utils/rateLimiter";

export const DELETE = withRateLimitAndCSRF(handler, strictAuthLimiter);
```

### Pattern 3: Form Submission

```typescript
import { withCSRFProtection } from "@/utils/csrfProtection";

export const POST = withCSRFProtection(handler);
```

### Pattern 4: Skip CSRF in Development (Testing)

```typescript
export const POST = withCSRFProtection(handler, {
  skipValidation: process.env.NODE_ENV === "development",
});
```

---

## 🔍 Error Handling

### Server-Side Error Responses

```typescript
// 403 Forbidden - CSRF validation failed
{
  "error": "CSRF validation failed",
  "message": "Invalid or missing CSRF token. Please refresh and try again.",
  "code": "CSRF_VALIDATION_FAILED"
}

// 429 Too Many Requests - Rate limit exceeded
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Try again in X seconds.",
  "retryAfter": 3600
}

// 401 Unauthorized - Not authenticated
{
  "error": "Unauthorized - Please sign in"
}
```

### Client-Side Error Handling

```typescript
async function makeProtectedRequest(endpoint: string, data: any) {
  const csrfToken = await getCsrfToken();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken || "",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    switch (response.status) {
      case 403:
        throw new Error("CSRF validation failed - please refresh");
      case 429:
        const retryAfter = response.headers.get("Retry-After");
        throw new Error(`Too many requests - try again in ${retryAfter}s`);
      case 401:
        throw new Error("Please sign in");
      default:
        throw new Error("Request failed");
    }
  }

  return response.json();
}
```

---

## ✅ Testing Checklist

### Before Deployment

- [ ] CSRF token generation works (`GET /api/csrf`)
- [ ] Valid token allows request
- [ ] Missing token returns 403
- [ ] Invalid token returns 403
- [ ] Expired token returns 403
- [ ] Reused token returns 403
- [ ] Rate limiting works correctly
- [ ] Client forms include CSRF tokens
- [ ] HTTPS enabled in production
- [ ] Environment variables set

### Test Commands

```bash
# 1. Get CSRF token (requires authentication)
curl -X GET http://localhost:3000/api/csrf \
  -H "Cookie: next-auth.session-token=SESSION_TOKEN"

# 2. Use token in protected request (should succeed)
curl -X POST http://localhost:3000/api/protected \
  -H "Cookie: next-auth.session-token=SESSION_TOKEN" \
  -H "X-CSRF-Token: CSRF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'

# 3. Without token (should fail with 403)
curl -X POST http://localhost:3000/api/protected \
  -H "Cookie: next-auth.session-token=SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"test":"data"}'
```

---

## 🛠️ Troubleshooting

### "CSRF validation failed" on valid requests

**Solutions:**

1. Ensure header is `X-CSRF-Token` (case-sensitive)
2. Get fresh token from `getCsrfToken()` or `/api/csrf`
3. Check session is still valid
4. Don't reuse tokens (they're single-use)

### Tokens not working in production

**Solutions:**

1. Verify `NEXTAUTH_URL` uses `https://`
2. Check `NODE_ENV=production`
3. Ensure SSL certificate is valid
4. Verify cookies have `secure: true`

### Development hot reload issues

**Solution:**

```typescript
export const POST = withCSRFProtection(handler, {
  skipValidation: process.env.NODE_ENV === "development",
});
```

---

## 📚 Full Documentation

For detailed information, see:

- **CSRF_PROTECTION_GUIDE.md** - Complete guide
- **CSRF_IMPLEMENTATION_SUMMARY.md** - Implementation details
- **utils/csrfProtection.ts** - Source code with inline docs

---

## 🔗 Quick Links

| Resource         | Path                                        |
| ---------------- | ------------------------------------------- |
| Token Generation | `GET /api/csrf`                             |
| CSRF Middleware  | `@/utils/csrfProtection`                    |
| Rate Limiters    | `@/utils/rateLimiter`                       |
| NextAuth Config  | `@/app/auth`                                |
| Examples         | `EXAMPLE_PAYMENT_VERIFICATION_WITH_CSRF.ts` |

---

**Need Help?** Check [CSRF_PROTECTION_GUIDE.md](CSRF_PROTECTION_GUIDE.md) for comprehensive documentation.
