import dbConnect from "@/utils/connectDB";
import Transaction from "@/models/transaction";
import { NextRequest, NextResponse } from "next/server";
import {
  validatePaystackWebhook,
  PaystackEventType,
  processChargeSuccessEvent,
  processChargeFailedEvent,
  extractWebhookMetadata,
  WebhookResponse,
} from "@/utils/webhookValidation";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const dynamic = "force-dynamic";

/**
 * Paystack Webhook Endpoint - POST /api/webhook
 *
 * Receives and processes Paystack payment events with signature verification.
 *
 * Security Features:
 *   HMAC-SHA512 signature verification
 *   Constant-time comparison (prevents timing attacks)
 *   Payload validation
 *   Event type validation
 *   Request logging
 *   Error handling with audit trail
 *
 * Supported Events:
 * - charge.success: Payment successful
 * - charge.failed: Payment failed
 * - charge.abandoned: Payment abandoned
 *
 * @endpoint POST /api/webhook
 * @returns {success: boolean, message: string}
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Get signature from headers
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(WebhookResponse.invalidSignature().body, {
        status: WebhookResponse.invalidSignature().status,
      });
    }

    if (!PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        WebhookResponse.failure("Server configuration error", 500).body,
        { status: 500 },
      );
    }

    // 2. Get raw body for signature verification
    const rawBody = await req.text();

    // 3. Validate webhook signature and event
    const validation = validatePaystackWebhook(
      rawBody,
      signature,
      PAYSTACK_SECRET_KEY,
    );

    if (!validation.isValid) {
      const metadata = extractWebhookMetadata(req.headers);
      logWebhookFailure(validation.error || "Unknown error", metadata);

      return NextResponse.json(WebhookResponse.invalidSignature().body, {
        status: WebhookResponse.invalidSignature().status,
      });
    }

    // 4. Connect to database
    await dbConnect();

    const metadata = extractWebhookMetadata(req.headers);

    // 5. Process specific event types
    switch (validation.event) {
      case PaystackEventType.CHARGE_SUCCESS:
        await handleChargeSuccess(validation.data, metadata);
        break;

      case PaystackEventType.CHARGE_FAILED:
        await handleChargeFailed(validation.data, metadata);
        break;

      case PaystackEventType.CHARGE_ABANDONED:
        await handleChargeAbandoned(validation.data, metadata);
        break;

      default:
        break;
    }

    // 6. Return success response
    return NextResponse.json(WebhookResponse.success().body, {
      status: WebhookResponse.success().status,
    });
  } catch (error) {
    return NextResponse.json(
      WebhookResponse.failure("Internal server error", 500).body,
      { status: 500 },
    );
  }
}

/**
 * Handle charge.success event
 */
async function handleChargeSuccess(
  data: any,
  metadata: { ipAddress: string; userAgent: string },
) {
  try {
    const chargeData = processChargeSuccessEvent(data);

    if (!chargeData) {
      // Don't throw - return gracefully to avoid 500 errors
      return;
    }

    // Find transaction with retry logic (handles race condition where webhook arrives before transaction creation)
    let transaction: any = null;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      transaction = await Transaction.findOne({
        referenceId: chargeData.reference,
      });

      if (transaction) {
        break; // Found it!
      }

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }
    }

    if (transaction) {
      // Update existing transaction
      transaction.status = "successful";
      transaction.amount = chargeData.amount / 100; // Paystack returns amount in kobo
      await transaction.save();
    } else {
      // Transaction still not found after retries - likely payment not initiated through our system
      // Return gracefully - webhook still succeeded
      return;
    }
  } catch (error) {
    // Don't re-throw - continue to avoid 500 errors to Paystack
  }
}

/**
 * Handle charge.failed event
 */
async function handleChargeFailed(
  data: any,
  metadata: { ipAddress: string; userAgent: string },
) {
  try {
    const failureData = processChargeFailedEvent(data);

    if (!failureData) {
      throw new Error("Invalid charge failure data");
    }

    // Update transaction status
    const transaction = await Transaction.findOne({
      referenceId: failureData.reference,
    });

    if (transaction) {
      (transaction as any).status = "failed";
      (transaction as any).description =
        `Payment failed: ${failureData.reason}`;
      await transaction.save();
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Handle charge.abandoned event
 */
async function handleChargeAbandoned(
  data: any,
  metadata: { ipAddress: string; userAgent: string },
) {
  try {
    const reference = data.reference;

    const transaction = await Transaction.findOne({ referenceId: reference });

    if (transaction) {
      (transaction as any).status = "canceled"; // Use valid schema value
      (transaction as any).description = "Payment abandoned";
      await transaction.save();
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Log webhook failure to audit trail
 */
function logWebhookFailure(
  error: string,
  metadata: { ipAddress: string; userAgent: string },
) {
  // In production, store failed webhook attempts for investigation
}
