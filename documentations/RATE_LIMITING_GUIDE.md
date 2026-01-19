/\*\*

- RATE LIMITING IMPLEMENTATION GUIDE
- ==================================
-
- This file demonstrates how to integrate the custom rate limiting middleware
- into your existing API routes.
-
- Addresses AUDIT_REPORT.md issues:
- - P1-1: No rate limiting on APIs (CRITICAL)
- - P1-3: Email enumeration vulnerability (HIGH)
- - Security issue: POST /api/verifyTransaction - No rate limiting
    \*/

// ============================================================================
// PATTERN 1: BASIC RATE LIMITING WITH APPLYRATELIMIT
// ============================================================================
// Use this for simple endpoints that need basic protection

/\*
// Example: app/api/users/searchbyemail/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { applyRateLimit, apiLimiter } from '@/utils/rateLimitMiddleware';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
// Apply rate limiting
const rateLimitResponse = await applyRateLimit(req, apiLimiter);
if (rateLimitResponse) return rateLimitResponse;

// Verify authentication (required to prevent email enumeration)
const session = await getServerSession(authOptions);
if (!session?.user) {
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

// Your existing logic here
const { email } = req.nextUrl.searchParams;
// ... rest of implementation
}
\*/

// ============================================================================
// PATTERN 2: WRAPPED HANDLER WITH WITHRATELIMIT
// ============================================================================
// Use this for cleaner code with automatic header injection

/\*
// Example: app/api/properties/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, propertySearchLimiter } from '@/utils/rateLimitMiddleware';
import dbConnect from '@/utils/connectDB';
import Properties from '@/models/properties';

export const dynamic = 'force-dynamic';

async function searchProperties(req: NextRequest): Promise<NextResponse> {
await dbConnect();

try {
const { query, minPrice, maxPrice, location } = req.nextUrl.searchParams;

    const filter: any = {};
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ];
    }
    if (minPrice) filter.price = { $gte: Number(minPrice) };
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }
    if (location) filter.location = { $regex: location, $options: 'i' };

    const properties = await Properties.find(filter).limit(20);

    return NextResponse.json(properties);

} catch (error) {
return NextResponse.json(
{ error: 'Search failed' },
{ status: 500 }
);
}
}

// Wrap with rate limiting
export const GET = withRateLimit(searchProperties, propertySearchLimiter);
\*/

// ============================================================================
// PATTERN 3: LOGGING & CONDITIONAL RESET
// ============================================================================
// Use this for sensitive operations like authentication

/\*
// Example: app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimitAndLogging, authLimiter, resetRateLimit, getClientIP } from '@/utils/rateLimitMiddleware';
import dbConnect from '@/utils/connectDB';
import User from '@/models/user';
import bcrypt from 'bcrypt';

export const dynamic = 'force-dynamic';

async function loginHandler(req: NextRequest): Promise<NextResponse> {
const clientIP = getClientIP(req);

if (req.method !== 'POST') {
return NextResponse.json(
{ error: 'Method not allowed' },
{ status: 405 }
);
}

try {
await dbConnect();
const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Successful login - reset rate limit for this IP
    resetRateLimit(clientIP);

    // Create session and return (your existing logic)
    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      message: 'Login successful',
    });

} catch (error) {
return NextResponse.json(
{ error: 'Login failed' },
{ status: 500 }
);
}
}

// Wrap with logging and reset on success
export const POST = withRateLimitAndLogging(
loginHandler,
authLimiter,
{
logRequests: true,
resetOnSuccess: true,
}
);
\*/

// ============================================================================
// PATTERN 4: PAYMENT TRANSACTION WITH STRICT LIMITING
// ============================================================================
// Use this for critical financial operations

/\*
// Example: app/api/verifyTransaction/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, paymentLimiter } from '@/utils/rateLimitMiddleware';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import dbConnect from '@/utils/connectDB';
import Transaction from '@/models/transaction';
import axios from 'axios';

export const dynamic = 'force-dynamic';

async function verifyTransaction(req: NextRequest): Promise<NextResponse> {
// Verify user is authenticated
const session = await getServerSession(authOptions);
if (!session?.user) {
return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

try {
await dbConnect();
const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      );
    }

    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (!response.data.status) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    const paymentData = response.data.data;

    // Store transaction in database
    const transaction = await Transaction.create({
      userId: session.user.id,
      reference,
      amount: paymentData.amount,
      status: 'completed',
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      transaction,
    });

} catch (error) {
console.error('Transaction verification error:', error);
return NextResponse.json(
{ error: 'Verification failed' },
{ status: 500 }
);
}
}

export const POST = withRateLimit(verifyTransaction, paymentLimiter);
\*/

// ============================================================================
// PATTERN 5: EMAIL ENDPOINTS WITH RATE LIMITING
// ============================================================================
// Prevents email flooding attacks

/\*
// Example: app/api/sendSupportEmail/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, emailLimiter } from '@/utils/rateLimitMiddleware';
import { sendEmail } from '@/utils/mail';

export const dynamic = 'force-dynamic';

async function sendSupportEmail(req: NextRequest): Promise<NextResponse> {
if (req.method !== 'POST') {
return NextResponse.json(
{ error: 'Method not allowed' },
{ status: 405 }
);
}

try {
const { email, subject, message, category } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send email
    await sendEmail({
      to: process.env.SUPPORT_EMAIL,
      subject: `[${category}] ${subject}`,
      html: `
        <p>From: ${email}</p>
        <p>Subject: ${subject}</p>
        <p>Category: ${category}</p>
        <hr />
        <p>${message}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Support email sent successfully',
    });

} catch (error) {
return NextResponse.json(
{ error: 'Failed to send email' },
{ status: 500 }
);
}
}

export const POST = withRateLimit(sendSupportEmail, emailLimiter);
\*/

// ============================================================================
// PATTERN 6: AUTHENTICATION ENDPOINTS (SIGNUP)
// ============================================================================
// Use strict limiting on registration to prevent brute force

/_
// Example: app/api/users/createNewUser/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit, strictAuthLimiter } from '@/utils/rateLimitMiddleware';
import dbConnect from '@/utils/connectDB';
import User from '@/models/user';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '@/utils/mail';
import { v4 as uuidv4 } from 'uuid';
import _ as yup from 'yup';

export const dynamic = 'force-dynamic';

const userSchema = yup.object().shape({
name: yup.string().required('Name is required').trim(),
email: yup.string().email().required().trim(),
password: yup.string().required().min(8),
// ... other validations
});

async function createNewUser(req: NextRequest): Promise<NextResponse> {
if (req.method !== 'POST') {
return NextResponse.json(
{ error: 'Method not allowed' },
{ status: 405 }
);
}

try {
await dbConnect();
const body = await req.json();

    // Validate input
    await userSchema.validate(body, { abortEarly: false });

    // Check if user exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create user
    const verificationToken = uuidv4();
    const user = await User.create({
      ...body,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      isEmailVerified: false,
    });

    // Send verification email
    await sendVerificationEmail(body.email, verificationToken);

    return NextResponse.json(
      {
        success: true,
        message: 'User created. Please check your email for verification.',
      },
      { status: 201 }
    );

} catch (error) {
return NextResponse.json(
{ error: 'Registration failed' },
{ status: 500 }
);
}
}

export const POST = withRateLimit(createNewUser, strictAuthLimiter);
\*/

// ============================================================================
// QUICK REFERENCE: PREDEFINED LIMITERS
// ============================================================================
/\*
Import from utils/rateLimiter.ts:

1. apiLimiter
   - 100 requests per 15 minutes
   - Use for: General API endpoints
2. authLimiter
   - 5 requests per hour
   - Use for: Login, password reset attempts
3. strictAuthLimiter
   - 3 requests per 15 minutes
   - Use for: Sensitive authentication operations
4. paymentLimiter
   - 10 requests per hour
   - Use for: Payment verification, transactions
5. emailLimiter
   - 5 requests per hour
   - Use for: Email sending endpoints
6. propertySearchLimiter
   - 30 requests per minute
   - Use for: Property search/filter endpoints

You can also create custom limiters using:

- createRateLimiter(config)
- createUserBasedRateLimiter(config)
- createEndpointRateLimiter(endpoint, config)
  \*/

// ============================================================================
// RESPONSE HEADERS ADDED TO ALL RATE-LIMITED RESPONSES
// ============================================================================
/\*
Success responses include:

- X-RateLimit-Limit: 100 (max requests)
- X-RateLimit-Remaining: 87 (requests left in window)
- X-RateLimit-Reset: 1705607156000 (milliseconds timestamp)

Rate-limited error responses (429):

- Retry-After: 45 (seconds to wait)
- X-RateLimit-Limit: 5
- X-RateLimit-Remaining: 0
- X-RateLimit-Reset: 1705607156000

JSON Body:
{
"error": "Too many requests, please try again later.",
"retryAfter": 45,
"code": "RATE_LIMIT_EXCEEDED"
}
\*/

export const implementationGuide = 'See examples above for integration patterns';
