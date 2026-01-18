/**
 * EXAMPLE: Protected Authentication Endpoint with Rate Limiting
 *
 * This is an example implementation showing how to integrate rate limiting
 * into an authentication endpoint. This file is NOT part of the actual app -
 * it's meant to demonstrate the pattern.
 *
 * Copy and adapt this pattern to your existing auth endpoints.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  withRateLimitAndLogging,
  authLimiter,
  resetRateLimit,
  getClientIP,
} from "@/utils/rateLimitMiddleware";
import dbConnect from "@/utils/connectDB";
import User from "@/models/user";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";

/**
 * Login handler with authentication rate limiting
 *
 * This handler:
 * 1. Validates credentials
 * 2. Checks password against hash
 * 3. Creates session/token
 * 4. Resets rate limit on success
 *
 * Rate limiting:
 * - 5 attempts per hour
 * - Only counts failed attempts (skipSuccessfulRequests)
 * - Rate limit key is client IP
 */
async function loginHandler(req: NextRequest): Promise<NextResponse> {
  const clientIP = getClientIP(req);

  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    await dbConnect();

    const body = await req.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Log failed attempt with IP
      console.warn(`[Auth] Failed login attempt for ${email} from ${clientIP}`);

      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Check if email is verified
    // Note: Adapt to your actual User schema field name
    const isVerified =
      (user as any).isEmailVerified || (user as any).emailVerified || false;
    if (!isVerified) {
      return NextResponse.json(
        { error: "Please verify your email before logging in" },
        { status: 403 },
      );
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.warn(
        `[Auth] Failed password attempt for ${user.email} from ${clientIP}`,
      );

      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Successful login!
    // Rate limit will be reset via the withRateLimitAndLogging wrapper
    // (because resetOnSuccess: true)

    console.info(`[Auth] Successful login for ${user.email} from ${clientIP}`);

    // Create session data (adapt to your auth strategy)
    const sessionData = {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || "user",
      },
      timestamp: new Date(),
      ip: clientIP,
    };

    // Return success response
    // You can:
    // 1. Create JWT token
    // 2. Create NextAuth session
    // 3. Set secure cookie
    // Adapt based on your auth strategy

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: sessionData.user,
        // Add token if using JWT
        // token: jwt.sign(sessionData, process.env.JWT_SECRET)
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          // Set secure cookie if using sessions
          // 'Set-Cookie': `session=${token}; HttpOnly; Secure; SameSite=Strict`
        },
      },
    );
  } catch (error) {
    console.error("[Auth] Login error:", error);

    return NextResponse.json(
      { error: "Login failed. Please try again later." },
      { status: 500 },
    );
  }
}

/**
 * POST handler with rate limiting
 *
 * Rate limiting behavior:
 * - 5 attempts per hour (authLimiter)
 * - Logs each request to console
 * - Resets rate limit on successful login
 * - Response includes X-RateLimit-* headers
 */
export const POST = withRateLimitAndLogging(loginHandler, authLimiter, {
  logRequests: true,
  resetOnSuccess: true,
  resetOnFailure: false, // Count failed attempts
});

/**
 * Usage in your client:
 *
 * const response = await fetch('/api/auth/login', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ email, password })
 * });
 *
 * if (response.status === 429) {
 *   const retryAfter = response.headers.get('Retry-After');
 *   console.error(`Rate limited. Retry after ${retryAfter} seconds`);
 * }
 *
 * const data = await response.json();
 * if (response.ok) {
 *   // Store token/session
 *   localStorage.setItem('token', data.token);
 * }
 */
