/**
 * Example: Payment Verification with CSRF Protection
 *
 * This example demonstrates how to apply CSRF protection to the payment verification endpoint,
 * one of the CRITICAL endpoints identified in AUDIT_REPORT.md.
 *
 * Security Features:
 * ✅ Rate limiting (10 requests/hour)
 * ✅ CSRF token validation (single-use tokens)
 * ✅ Authentication required
 * ✅ Audit logging
 *
 * @endpoint POST /api/verifyTransaction
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import { withRateLimitAndCSRF } from "@/utils/csrfProtection";
import { paymentLimiter } from "@/utils/rateLimiter";
import connectDB from "@/utils/connectDB";
import Transaction from "@/models/transaction";
import User from "@/models/user";

/**
 * Payment verification handler
 * Protected by both rate limiting and CSRF validation
 */
async function verifyTransactionHandler(
  req: NextRequest,
): Promise<NextResponse> {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please sign in" },
        { status: 401 },
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { reference, amount, propertyId } = body;

    // 3. Validation
    if (!reference || !amount || !propertyId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: reference, amount, propertyId",
        },
        { status: 400 },
      );
    }

    // 4. Database connection
    await connectDB();

    // 5. Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // 6. Check for duplicate transaction
    const existingTransaction = await Transaction.findOne({
      referenceId: reference,
      userId: user._id,
    });

    if (existingTransaction) {
      // Already processed
      return NextResponse.json({
        success: true,
        message: "Transaction already verified",
        transaction: {
          id: existingTransaction._id,
          status: existingTransaction.status,
          reference: existingTransaction.referenceId,
        },
      });
    }

    // 7. Verify payment with payment gateway (mock example)
    const paymentVerified = await verifyWithPaymentGateway(reference, amount);

    if (!paymentVerified) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment verification failed - Invalid transaction",
        },
        { status: 400 },
      );
    }

    // 8. Create transaction record
    const transaction = await Transaction.create({
      userId: user._id,
      propertyId,
      referenceId: reference,
      amount,
      status: "successful",
      paymentMethod: "paystack", // or from request
      metadata: {
        verifiedBy: session.user.email,
        verificationIP: req.headers.get("x-forwarded-for") || "unknown",
      },
    } as any);

    // 9. Success response
    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      transaction: {
        id: (transaction as any)?._id,
        status: (transaction as any)?.status,
        reference: (transaction as any)?.referenceId,
        amount: (transaction as any)?.amount,
      },
    });
  } catch (error) {
    console.error("❌ [PAYMENT] Verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed - Internal error",
      },
      { status: 500 },
    );
  }
}

/**
 * Mock payment gateway verification
 * Replace with actual payment gateway API call
 */
async function verifyWithPaymentGateway(
  reference: string,
  amount: number,
): Promise<boolean> {
  // Example: Paystack verification
  // const response = await fetch(
  //   `https://api.paystack.co/transaction/verify/${reference}`,
  //   {
  //     headers: {
  //       Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  //     },
  //   }
  // );
  // const data = await response.json();
  // return data.status && data.data.amount === amount * 100;

  // Mock implementation
  return true;
}

/**
 * Export protected endpoint
 * ✅ Combines rate limiting + CSRF protection
 */
export const POST = withRateLimitAndCSRF(
  verifyTransactionHandler,
  paymentLimiter, // 10 requests per hour
);

/**
 * Client-side usage example:
 *
 * ```typescript
 * import { getCsrfToken } from "next-auth/react";
 *
 * async function verifyPayment(reference: string, amount: number, propertyId: string) {
 *   // 1. Get CSRF token
 *   const csrfToken = await getCsrfToken();
 *
 *   // 2. Make request with token
 *   const response = await fetch('/api/verifyTransaction', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *       'X-CSRF-Token': csrfToken || '',
 *     },
 *     body: JSON.stringify({ reference, amount, propertyId }),
 *   });
 *
 *   const data = await response.json();
 *
 *   if (!response.ok) {
 *     // Handle errors
 *     if (response.status === 403) {
 *       console.error('CSRF validation failed - refresh and try again');
 *     } else if (response.status === 429) {
 *       console.error('Rate limit exceeded - try again later');
 *     }
 *     throw new Error(data.message);
 *   }
 *
 *   return data;
 * }
 * ```
 */
