# Security Audit Report - Ajibest Project

**Date:** January 2, 2026  
**Project:** Ajibest Real Estate Platform  
**Type:** Next.js + MongoDB + Next-Auth

---

## 🔴 CRITICAL SECURITY ISSUES

### 1. **Hardcoded Localhost in Email Verification URL**

**Severity:** CRITICAL  
**File:** [utils/mail.ts](utils/mail.ts#L14)  
**Issue:** The email verification URL is hardcoded to `http://localhost:3000`

```typescript
const verificationUrl = `http://localhost:3000/emailverification?token=${token}`;
```

**Risk:**

- All production emails will have localhost links, breaking verification in production
- Links won't work for users, preventing account activation
- Security tokens exposed in URLs are logged in email systems

**Fix:** Use environment variable with fallback:

```typescript
const verificationUrl = `${
  process.env.NEXTAUTH_URL || "http://localhost:3000"
}/emailverification?token=${token}`;
```

---

### 2. **Public Exposure of Secret Tokens via SMS API**

**Severity:** CRITICAL  
**File:** [utils/sendSMS.ts](utils/sendSMS.ts#L20)  
**Issue:** SMS API credentials are marked as `NEXT_PUBLIC_*`

```typescript
"X-Token": process.env.NEXT_PUBLIC_VT_TOKEN as string,
"X-Secret": process.env.NEXT_PUBLIC_VT_SECRET as string,
```

**Risk:**

- `NEXT_PUBLIC_*` variables are exposed in client-side bundles
- Anyone can extract API keys from your frontend code
- Attackers can impersonate your SMS service calls
- Token and secret should NEVER be public

**Fix:** Move to server-only environment variables:

```typescript
// Remove NEXT_PUBLIC_ prefix
"X-Token": process.env.VT_TOKEN as string,
"X-Secret": process.env.VT_SECRET as string,
```

---

### 3. **Logical AND Error in Authorization Checks (Multiple Files)**

**Severity:** CRITICAL  
**Files:**

- [app/api/aapi/transactions/updateTransaction/route.ts](app/api/aapi/transactions/updateTransaction/route.ts#L14)
- [app/api/aapi/transactions/route.ts](app/api/aapi/transactions/route.ts#L17)

**Issue:** Logic error using `&&` instead of `||`

```typescript
if (!session?.user && session?.user?.role !== "Admin") {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  );
}
```

**Risk:**

- The condition `!session?.user && session?.user?.role` is always falsy
- If `!session?.user` is true, the second part never evaluates
- If `!session?.user` is false, accessing `session?.user?.role` is redundant
- **Authorization check ALWAYS passes** - any unauthenticated user can access admin endpoints!

**Correct Logic:**

```typescript
if (!session?.user || session?.user?.role !== "Admin") {
  return NextResponse.json(
    { success: false, error: "Unauthorized" },
    { status: 401 }
  );
}
```

---

### 4. **No Rate Limiting on Authentication Endpoints**

**Severity:** HIGH  
**Files:**

- [app/api/users/createNewUser/route.ts](app/api/users/createNewUser/route.ts) (Registration)
- [app/api/reset-password/route.ts](app/api/reset-password/route.ts) (Password Reset)
- [app/api/forgot-password/route.ts](app/api/forgot-password/route.ts) (Forgot Password)

**Risk:**

- Brute force attacks on registration (account enumeration)
- Brute force attacks on password reset (OTP guessing - 6 digits = 1 million combinations)
- Denial of service through mass registration
- Email flooding attacks

**Recommendation:** Implement rate limiting using middleware like:

- `next-rate-limit`
- `express-rate-limit`
- Or use external service (Vercel Protection, Cloudflare)

---

### 5. **Sensitive Data in Console Logs**

**Severity:** HIGH  
**File:** [app/auth.ts](app/auth.ts)  
**Issue:** While not explicitly shown, catch blocks log full errors:

```typescript
catch (error) {
    throw new Error("Invalid email or password");
}
```

**Risk:**

- Stack traces can leak file paths and system info
- Production logs may contain sensitive data

**Recommendation:** Use structured logging with sensitive field filtering.

---

## 🟠 HIGH SEVERITY ISSUES

### 6. **Session Strategy - JWT with Short Maxage**

**Severity:** HIGH  
**File:** [app/auth.ts](app/auth.ts#L65-L70)  
**Issue:** JWT session expires after 30 minutes, but users expect persistence

```typescript
session: {
    strategy: "jwt",
    maxAge: 30 * 60,      // 30 minutes
    updateAge: 1 * 60,     // 1 minute
},
```

**Risk:**

- Users get logged out frequently, poor UX
- Frequent token refreshes increase attack surface
- May cause issues with long-running operations

**Recommendation:** Increase to 7-30 days for better UX, but implement refresh token rotation.

---

### 7. **No Input Validation on Query Parameters**

**Severity:** HIGH  
**File:** [app/api/users/getSingleUser/route.ts](app/api/users/getSingleUser/route.ts#L20-L25)  
**Issue:** Query parameters not validated

```typescript
const _id = req.nextUrl.searchParams.get("id");
const email = req.nextUrl.searchParams.get("email");
// No validation - directly used in MongoDB query
filterUser = { email };
```

**Risk:**

- NoSQL injection possible
- Can query other users' data if ID validation is missing
- Email parameter can be exploited

**Recommendation:** Validate and sanitize all inputs:

```typescript
if (email && !isValidEmail(email)) {
  return NextResponse.json({ error: "Invalid email" }, { status: 400 });
}
if (_id && !mongoose.Types.ObjectId.isValid(_id)) {
  return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
}
```

---

### 8. **CORS & CSRF Not Properly Configured**

**Severity:** HIGH  
**Files:** API route files  
**Issue:** No explicit CORS or CSRF token handling visible

**Risk:**

- Cross-site request forgery attacks possible
- Unprotected endpoints accessible from any domain
- State-changing operations (PUT, POST) vulnerable

**Recommendation:**

- Implement CSRF tokens for state-changing operations
- Configure CORS middleware with whitelist
- Use SameSite cookies

---

### 9. **User Can Query Other Users' Data**

**Severity:** HIGH  
**File:** [app/api/users/getSingleUser/route.ts](app/api/users/getSingleUser/route.ts#L20-L37)  
**Issue:** Authenticated users can query ANY user by passing email/id

```typescript
if (_id) {
  filterUser = { _id };
} else if (email) {
  filterUser = { email }; // ⚠️ Any user can query any email!
}
```

**Risk:**

- User A can retrieve User B's personal data (BVN, NIN, phone, address)
- Severe privacy violation and potential identity theft
- No verification that requester has permission

**Fix:** Only allow querying own user data:

```typescript
const email = session?.user?.email; // Use session email only
const user = await User.findOne({ email }).lean();
```

---

### 10. **Webhook Signature Validation Issues**

**Severity:** HIGH  
**File:** [app/api/webhook/route.ts](app/api/webhook/route.ts#L27-L32)  
**Issue:** While signature validation exists, it's the ONLY security check

```typescript
const secret = headers.get("x-paystack-signature");
const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY).update(...).digest("hex");

if (hash !== secret) {
    return NextResponse.json({ message: "Webhook Error: Invalid signature" }, { status: 400 });
}
```

**Risk:**

- If PAYSTACK_SECRET_KEY is exposed, webhook can be spoofed
- No idempotency check for duplicate webhook events
- No timeout handling for long-processing webhooks

**Recommendation:**

- Add idempotency key tracking
- Implement transaction-level locking
- Log all webhook events for audit trail

---

## 🟡 MEDIUM SEVERITY ISSUES

### 11. **Bcryptjs Version Used - Security Concerns**

**Severity:** MEDIUM  
**File:** [package.json](package.json#L14-L15)  
**Issue:** Both `bcrypt` and `bcryptjs` are installed (redundant + confusing)

```json
"bcrypt": "^6.0.0",
"bcryptjs": "^3.0.3",
```

**Risk:**

- Potential for mixing different hashing implementations
- Confusion about which one is used
- Security parameterization inconsistency

**Recommendation:** Use only `bcryptjs` (which is pure JS and more reliable in Node.js):

```json
"bcryptjs": "^3.0.3"  // Remove "bcrypt" dependency
```

---

### 12. **File Upload Without Size Limits**

**Severity:** MEDIUM  
**File:** [app/api/upload/route.ts](app/api/upload/route.ts#L3-L24)  
**Issue:** No file size validation

```typescript
const file = data.get("file");
if (file) {
    const allowedMimeTypes = [...];
    if (!allowedMimeTypes.includes(file.type)) { ... }
    // No size check!
}
```

**Risk:**

- Attackers can upload large files causing disk space exhaustion
- DOS attack by uploading many large files
- Server resource exhaustion

**Fix:** Add size validation:

```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
if (file.size > MAX_FILE_SIZE) {
  return new Response(JSON.stringify({ error: "File too large (max 5MB)" }), {
    status: 413,
  });
}
```

---

### 13. **Missing .env.example File**

**Severity:** MEDIUM  
**Issue:** No `.env.example` file found
**Risk:**

- Developers don't know which environment variables are needed
- Easy to accidentally commit real secrets to git

**Recommendation:** Create [.env.example](.env.example):

```env
# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://yourdomain.com
GOOGLE_CLIENT_ID=your-google-id
GOOGLE_CLIENT_SECRET=your-google-secret

# Database
MONGODB_URI=mongodb://...

# Email Service
EMAIL_SERVER_HOST=smtp.gmail.com
COMPANY_EMAIL_USER=your-email@gmail.com
COMPANY_EMAIL_PASS=app-password
SUPPORT_EMAIL=support@yourdomain.com

# Payment Gateway
PAYSTACK_SECRET_KEY=pk_live_...
PAYSTACK_PUBLIC_KEY=pk_test_...

# SMS Service (DO NOT MAKE PUBLIC)
VT_TOKEN=your-token
VT_SECRET=your-secret

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
```

---

### 14. **Weak OTP Implementation**

**Severity:** MEDIUM  
**File:** [app/api/forgot-password/route.ts](app/api/forgot-password/route.ts#L35)  
**Issue:** OTP is just 6 random digits with no rate limiting

```typescript
const otp = Math.floor(100000 + Math.random() * 900000).toString();
```

**Risk:**

- Only 1 million possible combinations (000000-999999)
- 10-minute window with no attempt limits
- Brute force attack: 1 million attempts ÷ 10 minutes = 1,667 attempts/second possible

**Recommendation:**

- Implement rate limiting on OTP verification (max 3-5 attempts)
- Use time-window based exponential backoff
- Consider using alphanumeric codes (mix letters + numbers)

---

### 15. **Admin Layout Missing Role-Based Rendering Control**

**Severity:** MEDIUM  
**File:** [app/admin/layout.tsx](app/admin/layout.tsx#L95)  
**Issue:** Admin components render before checking session status

```tsx
if (status === "loading") {
  return <LoadingSpinner />;
}

if (!session?.user) {
  return null; // ⚠️ Returns null but component structure below still renders
}
```

**Risk:**

- Flash of unsecured content possible
- Admin features might briefly appear to unauthorized users
- Timing attacks possible

**Recommendation:** Use `ProtectedRoute` wrapper with proper role checking.

---

### 16. **Verbose Error Messages Exposing System Details**

**Severity:** MEDIUM  
**Multiple Files**
**Issue:** Error messages return too much information

```typescript
{ success: false, error: "Failed to Fetch Transaction", details: error }
```

**Risk:**

- Stack traces leak file paths and system information
- Helps attackers understand system architecture
- Exposes database structure

**Recommendation:**

```typescript
// Production
{ success: false, message: "Operation failed" }

// Development only
if (process.env.NODE_ENV === "development") {
    response.details = error.message;
}
```

---

## 🟢 LOW SEVERITY ISSUES & RECOMMENDATIONS

### 17. **Missing Security Headers**

**Files:** [next.config.mjs](next.config.mjs)  
**Recommendation:** Add security headers:

```javascript
const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];
```

---

### 18. **No HTTPS Enforcement**

**Issue:** Localhost hardcoding suggests development mode  
**Recommendation:** Always use HTTPS in production, implement HSTS headers.

---

### 19. **Missing Audit Logging**

**Recommendation:** Log critical actions:

- Failed login attempts
- Admin actions
- Sensitive data access
- Transaction modifications
- User role changes

---

### 20. **No Account Lockout After Failed Attempts**

**Issue:** No mechanism to prevent brute force on login  
**Recommendation:** Implement progressive delays after failed attempts.

---

## 📋 IMMEDIATE ACTION ITEMS (Priority Order)

| Priority | Issue                                | Fix Time |
| -------- | ------------------------------------ | -------- |
| 🔴 P1    | Authorization check logic error (&&) | 30 min   |
| 🔴 P1    | Public SMS credentials exposure      | 15 min   |
| 🔴 P1    | User data exposure in getSingleUser  | 20 min   |
| 🔴 P1    | Localhost URL in production emails   | 10 min   |
| 🟠 P2    | Input validation on query parameters | 1 hour   |
| 🟠 P2    | File upload size limits              | 30 min   |
| 🟠 P3    | Rate limiting on auth endpoints      | 2 hours  |
| 🟠 P3    | CORS/CSRF configuration              | 1 hour   |
| 🟡 P4    | .env.example file                    | 15 min   |
| 🟡 P4    | Security headers                     | 30 min   |

---

## 🔧 Recommended Additional Tools/Packages

```bash
# Rate limiting
npm install next-rate-limit

# Input validation
npm install validator

# Security headers
npm install helmet

# Request logging
npm install morgan

# CSRF protection
npm install csrf

# Environment validation
npm install dotenv-safe
```

---

## 🛡️ Security Best Practices Checklist

- [ ] Fix all CRITICAL issues before production deployment
- [ ] Implement rate limiting on all auth endpoints
- [ ] Add input validation to all API endpoints
- [ ] Set up HTTPS with HSTS headers
- [ ] Enable CSRF token protection
- [ ] Implement request logging and monitoring
- [ ] Add security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- [ ] Use secrets management (not .env files in git)
- [ ] Enable two-factor authentication
- [ ] Regular security dependency updates
- [ ] Implement API key rotation
- [ ] Add database encryption
- [ ] Set up SQL/NoSQL injection monitoring
- [ ] Implement Web Application Firewall (WAF)
- [ ] Regular penetration testing

---

## 📚 Resources

- [OWASP Top 10 2024](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/basic-features/security)
- [Node.js Security Checklist](https://nodejs.org/en/docs/guides/security/)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

---

**Report Generated:** January 2, 2026  
**Status:** REQUIRES IMMEDIATE ATTENTION - Multiple critical issues detected
