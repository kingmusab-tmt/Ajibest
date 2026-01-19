/**
 * EXAMPLE: Protected Payment Verification Endpoint with Rate Limiting
 *
 * This example shows how to apply rate limiting to payment processing endpoints.
 * This addresses the AUDIT_REPORT.md finding:
 * "POST /api/verifyTransaction - No rate limiting on payment verification"
 *
 * This file is an EXAMPLE - copy and adapt the pattern to your actual
 * app/api/verifyTransaction/route.ts file.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  withRateLimit,
  addRateLimitHeaders,
  paymentLimiter,
  getClientIP,
} from "@/utils/rateLimitMiddleware";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import dbConnect from "@/utils/connectDB";
import Transaction from "@/models/transaction";
import axios from "axios";

export const dynamic = "force-dynamic";

/**
 * Verify transaction with Paystack
 *
 * This handler:
 * 1. Verifies user is authenticated
 * 2. Validates transaction reference
 * 3. Calls Paystack API to verify payment
 * 4. Stores transaction in database
 * 5. Returns verification result
 *
 * Rate limiting:
 * - 10 requests per hour (paymentLimiter)
 * - Prevents payment fraud/duplicate charges
 * - IP-based limiting
 * - Returns Retry-After header when limited
 */
async function verifyTransactionHandler(
  req: NextRequest,
): Promise<NextResponse> {
  const clientIP = getClientIP(req);

  // Verify request method
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    // Verify user is authenticated
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.warn(
        `[Payment] Unauthorized verification attempt from ${clientIP}`,
      );

      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { reference } = body;

    // Validate reference
    if (!reference || typeof reference !== "string") {
      return NextResponse.json(
        { error: "Invalid transaction reference" },
        { status: 400 },
      );
    }

    console.info(
      `[Payment] Verifying transaction ${reference} for user ${session.user.email}`,
    );

    await dbConnect();

    // Check if transaction already verified (prevent duplicates)
    const existingTransaction = await Transaction.findOne({
      referenceId: reference,
      userId: session.user.email,
    });

    if (existingTransaction && existingTransaction.status === "successful") {
      console.warn(
        `[Payment] Duplicate verification attempt for ${reference} from ${clientIP}`,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Transaction already verified",
          transaction: existingTransaction,
        },
        { status: 400 },
      );
    }

    // Verify payment with Paystack
    let paystackResponse;
    try {
      paystackResponse = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
          timeout: 10000, // 10 second timeout
        },
      );
    } catch (error) {
      console.error("[Payment] Paystack API error:", error);

      return NextResponse.json(
        { error: "Payment verification service unavailable" },
        { status: 503 },
      );
    }

    // Check if payment was successful
    if (!paystackResponse.data?.status || !paystackResponse.data?.data) {
      return NextResponse.json(
        { error: "Invalid payment verification response" },
        { status: 400 },
      );
    }

    const paymentData = paystackResponse.data.data;

    // Verify payment status
    if (paymentData.status !== "success") {
      console.warn(
        `[Payment] Payment not successful. Status: ${paymentData.status} for ${reference}`,
      );

      return NextResponse.json(
        {
          success: false,
          error: "Payment was not completed successfully",
          status: paymentData.status,
        },
        { status: 400 },
      );
    }

    // Verify amount matches expected amount (if you have the original amount)
    // This prevents man-in-the-middle attacks
    // const expectedAmount = await getExpectedAmount(reference);
    // if (paymentData.amount !== expectedAmount) {
    //   throw new Error('Amount mismatch');
    // }

    // Store or update transaction
    const transaction = await Transaction.findOneAndUpdate(
      { referenceId: reference },
      {
        userId: session.user.email,
        referenceId: reference,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: "successful",
        paystackData: paymentData,
        verificationIP: clientIP,
        verificationDate: new Date(),
        metadata: {
          authorization: paymentData.authorization,
          customer: paymentData.customer,
        },
      },
      { upsert: true, new: true },
    );

    console.info(
      `[Payment] Transaction verified successfully: ${reference} for user ${session.user.email}`,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Payment verified successfully",
        transaction: {
          id: transaction._id,
          referenceId: (transaction as any).referenceId,
          amount: (transaction as any).amount,
          status: (transaction as any).status,
          timestamp: new Date(),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const clientIP = getClientIP(req);
    console.error(`[Payment] Verification error from ${clientIP}:`, error);

    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 },
    );
  }
}

/**
 * POST handler with rate limiting
 *
 * Rate limiting configuration:
 * - 10 requests per hour (paymentLimiter)
 * - Prevents payment fraud
 * - Returns 429 status when limit exceeded
 * - Includes Retry-After header
 *
 * Response includes:
 * - X-RateLimit-Limit: 10
 * - X-RateLimit-Remaining: 9
 * - X-RateLimit-Reset: [timestamp]
 */
export const POST = withRateLimit(verifyTransactionHandler, paymentLimiter);

/**
 * Client-side usage example:
 *
 * async function verifyPayment(reference: string) {
 *   try {
 *     const response = await fetch('/api/verifyTransaction', {
 *       method: 'POST',
 *       headers: { 'Content-Type': 'application/json' },
 *       body: JSON.stringify({ reference })
 *     });
 *
 *     // Handle rate limiting
 *     if (response.status === 429) {
 *       const retryAfter = response.headers.get('Retry-After');
 *       console.error(
 *         `Rate limited. Please retry after ${retryAfter} seconds`
 *       );
 *       return;
 *     }
 *
 *     const data = await response.json();
 *     if (response.ok) {
 *       console.log('Payment verified:', data.transaction);
 *       // Process successful payment
 *     } else {
 *       console.error('Verification failed:', data.error);
 *     }
 *   } catch (error) {
 *     console.error('Verification request failed:', error);
 *   }
 * }
 */

/**
 * Testing rate limiting:
 *
 * // Make 11 requests in quick succession
 * for i in {1..11}; do
 *   curl -X POST http://localhost:3000/api/verifyTransaction \
 *     -H "Content-Type: application/json" \
 *     -d '{"reference":"test_'$i'"}'
 *   echo "Request $i done"
 * done
 *
 * // Requests 1-10: 200 OK
 * // Requests 11+: 429 Too Many Requests with Retry-After header
 */
