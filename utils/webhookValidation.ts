/**
 * Paystack Webhook Signature Validation Utility
 *
 * Implements HMAC-SHA512 signature verification for Paystack webhooks.
 * Follows Paystack security best practices and handles edge cases.
 *
 * @module webhookValidation
 * @category Security
 */

import crypto from "crypto";

/**
 * Paystack webhook verification configuration
 */
export interface PaystackWebhookConfig {
  secretKey: string;
  signatureHeader?: string;
  toleranceSeconds?: number;
}

/**
 * Paystack webhook event types
 */
export enum PaystackEventType {
  CHARGE_SUCCESS = "charge.success",
  CHARGE_FAILED = "charge.failed",
  CHARGE_ABANDONED = "charge.abandoned",
  TRANSFER_SUCCESS = "transfer.success",
  TRANSFER_FAILED = "transfer.failed",
  TRANSFER_REVERSED = "transfer.reversed",
  INVOICE_CREATE = "invoice.create",
  INVOICE_UPDATE = "invoice.update",
  INVOICE_PAYMENT_REQUESTED = "invoice.payment_requested",
  SUBSCRIPTION_CREATE = "subscription.create",
  SUBSCRIPTION_DISABLE = "subscription.disable",
  SUBSCRIPTION_SLIP = "subscription.slip",
  CUSTOMER_IDENTIFICATION = "customeridentification",
}

/**
 * Validated webhook payload
 */
export interface ValidatedWebhookPayload {
  isValid: boolean;
  event?: PaystackEventType;
  data?: any;
  error?: string;
  timestamp?: number;
}

/**
 * Paystack webhook signature validation
 *
 * Implements HMAC-SHA512 signature verification as per Paystack documentation.
 * The signature is computed using the raw request body and the secret key.
 *
 * @param payload - Raw request body (as string)
 * @param signature - Signature from x-paystack-signature header
 * @param secretKey - Paystack secret key
 * @returns True if signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyPaystackSignature(
 *   rawBody,
 *   signatureFromHeader,
 *   process.env.PAYSTACK_SECRET_KEY!
 * );
 * ```
 */
export function verifyPaystackSignature(
  payload: string | Buffer,
  signature: string,
  secretKey: string,
): boolean {
  if (!payload || !signature || !secretKey) {
    console.warn("⚠️ [WEBHOOK] Missing payload, signature, or secret key");
    return false;
  }

  try {
    // Convert payload to string if it's a Buffer
    const payloadString =
      typeof payload === "string" ? payload : payload.toString("utf-8");

    // Compute HMAC-SHA512 hash
    const computedHash = crypto
      .createHmac("sha512", secretKey)
      .update(payloadString)
      .digest("hex");

    // Constant-time comparison to prevent timing attacks
    const isValid = crypto.timingSafeEqual(
      Buffer.from(computedHash),
      Buffer.from(signature),
    );

    if (!isValid) {
      console.warn("  [WEBHOOK] Signature verification failed");
      console.debug(
        `Expected: ${computedHash.substring(0, 10)}...`,
        `Got: ${signature.substring(0, 10)}...`,
      );
    }

    return isValid;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes(
        "input and comparison buffers must have the same length",
      )
    ) {
      console.warn(
        "  [WEBHOOK] Signature length mismatch - possible tampering",
      );
      return false;
    }
    console.error("  [WEBHOOK] Signature verification error:", error);
    return false;
  }
}

/**
 * Validate and parse Paystack webhook event
 *
 * @param rawBody - Raw request body
 * @param signatureHeader - x-paystack-signature header value
 * @param secretKey - Paystack secret key
 * @returns Validated webhook payload
 *
 * @example
 * ```typescript
 * const validated = validatePaystackWebhook(
 *   await req.text(),
 *   req.headers.get("x-paystack-signature") || "",
 *   process.env.PAYSTACK_SECRET_KEY!
 * );
 *
 * if (!validated.isValid) {
 *   throw new Error(validated.error);
 * }
 *
 * switch (validated.event) {
 *   case PaystackEventType.CHARGE_SUCCESS:
 *     // Handle successful charge
 *     break;
 * }
 * ```
 */
export function validatePaystackWebhook(
  rawBody: string | Buffer,
  signatureHeader: string,
  secretKey: string,
): ValidatedWebhookPayload {
  // 1. Verify signature
  if (!verifyPaystackSignature(rawBody, signatureHeader, secretKey)) {
    return {
      isValid: false,
      error: "Invalid webhook signature",
    };
  }

  // 2. Parse JSON payload
  let event: any;
  try {
    const bodyString =
      typeof rawBody === "string" ? rawBody : rawBody.toString("utf-8");
    event = JSON.parse(bodyString);
  } catch (error) {
    return {
      isValid: false,
      error: "Invalid JSON payload",
    };
  }

  // 3. Validate event structure
  if (!event.event || !event.data) {
    return {
      isValid: false,
      error: "Missing event or data field",
    };
  }

  // 4. Validate event type
  const validEventTypes = Object.values(PaystackEventType);
  if (!validEventTypes.includes(event.event)) {
    return {
      isValid: false,
      error: `Unknown event type: ${event.event}`,
    };
  }

  return {
    isValid: true,
    event: event.event,
    data: event.data,
    timestamp: Date.now(),
  };
}

/**
 * Process charge.success event
 *
 * @param data - Event data from Paystack
 * @returns Processed transaction data
 *
 * @example
 * ```typescript
 * const processedData = processChargeSuccessEvent(event.data);
 * // Result: { reference, amount, status, email, ... }
 * ```
 */
export interface ChargeSuccessData {
  reference: string;
  amount: number;
  email: string;
  currency: string;
  customer_id: number;
  status: "success" | "failed" | "abandoned";
  paid_at?: string;
  created_at?: string;
  authorization?: {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
  };
}

export function processChargeSuccessEvent(data: any): ChargeSuccessData | null {
  try {
    // Log the actual data received for debugging
    console.log("🔍 [WEBHOOK] Processing charge.success data:", {
      reference: data.reference,
      amount: data.amount,
      email: data.email || data.customer?.email,
      status: data.status,
      hasCustomer: !!data.customer,
    });

    // More flexible validation - only require reference
    if (!data.reference) {
      console.warn("⚠️ [WEBHOOK] Missing reference field");
      console.warn("Available fields:", Object.keys(data));
      return null;
    }

    // Extract email from customer object if not directly available
    const email = data.email || data.customer?.email || "unknown@example.com";

    return {
      reference: data.reference,
      amount: data.amount || 0,
      email: email,
      currency: data.currency || "NGN",
      customer_id: data.customer?.id || data.customer_id || 0,
      status: data.status as "success" | "failed" | "abandoned",
      paid_at: data.paid_at,
      created_at: data.created_at,
      authorization: data.authorization,
    };
  } catch (error) {
    console.error("  [WEBHOOK] Error processing charge.success event:", error);
    console.error("Data received:", JSON.stringify(data, null, 2));
    return null;
  }
}

/**
 * Process charge.failed event
 *
 * @param data - Event data from Paystack
 * @returns Processed failure data
 */
export function processChargeFailedEvent(data: any): any {
  try {
    return {
      reference: data.reference,
      amount: data.amount,
      email: data.email,
      reason: data.reason || "Unknown reason",
      failure_code: data.failure_code,
      failure_message: data.failure_message,
      status: "failed",
    };
  } catch (error) {
    console.error("  [WEBHOOK] Error processing charge.failed event:", error);
    return null;
  }
}

/**
 * Webhook security logger
 * Logs webhook events for audit trail and debugging
 */
export interface WebhookLog {
  timestamp: number;
  event: string;
  reference?: string;
  status: "received" | "validated" | "processed" | "failed";
  ipAddress?: string;
  userAgent?: string;
  errorMessage?: string;
  data?: any;
}

/**
 * Log webhook event for audit trail
 *
 * @param log - Webhook log entry
 */
export async function logWebhookEvent(log: WebhookLog): Promise<void> {
  try {
    console.log(
      `📨 [WEBHOOK] ${log.status.toUpperCase()} - ${log.event} (${log.reference || "unknown"})`,
    );

    // In production, store in database
    // const auditLog = await AuditLog.create({
    //   action: `WEBHOOK_${log.event.toUpperCase()}`,
    //   details: {
    //     status: log.status,
    //     reference: log.reference,
    //     ipAddress: log.ipAddress,
    //   },
    //   status: log.status === "failed" ? "failed" : "success",
    //   timestamp: new Date(log.timestamp),
    // });
  } catch (error) {
    console.error("  [WEBHOOK] Error logging webhook event:", error);
  }
}

/**
 * Webhook request metadata extraction
 *
 * @param headers - Request headers
 * @returns Metadata
 */
export function extractWebhookMetadata(headers: Headers): {
  ipAddress: string;
  userAgent: string;
} {
  return {
    ipAddress: (headers.get("x-forwarded-for") ||
      headers.get("x-real-ip") ||
      headers.get("remote-addr") ||
      "unknown") as string,
    userAgent: (headers.get("user-agent") || "unknown") as string,
  };
}

/**
 * Webhook retry configuration
 */
export interface WebhookRetryConfig {
  maxRetries: number;
  delayMs: number;
  backoffMultiplier: number;
}

/**
 * Default webhook retry configuration
 */
export const DEFAULT_WEBHOOK_RETRY_CONFIG: WebhookRetryConfig = {
  maxRetries: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

/**
 * Simulate webhook retry with exponential backoff
 *
 * @param handler - Handler function to retry
 * @param config - Retry configuration
 * @returns Handler result or null if all retries failed
 */
export async function retryWebhookHandler<T>(
  handler: () => Promise<T>,
  config: Partial<WebhookRetryConfig> = {},
): Promise<T | null> {
  const finalConfig = {
    ...DEFAULT_WEBHOOK_RETRY_CONFIG,
    ...config,
  };

  let lastError: Error | null = null;
  let delay = finalConfig.delayMs;

  for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
    try {
      return await handler();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        `⚠️ [WEBHOOK] Handler failed (attempt ${attempt + 1}/${finalConfig.maxRetries + 1}):`,
        lastError.message,
      );

      // Don't delay after the last attempt
      if (attempt < finalConfig.maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= finalConfig.backoffMultiplier;
      }
    }
  }

  console.error("  [WEBHOOK] Handler failed after all retries:", lastError);
  return null;
}

/**
 * Webhook response helpers
 */
export const WebhookResponse = {
  /**
   * Return successful webhook response
   */
  success: (message: string = "Webhook received") => ({
    status: 200,
    body: { success: true, message },
  }),

  /**
   * Return failed webhook response
   */
  failure: (
    message: string = "Webhook processing failed",
    status: number = 400,
  ) => ({
    status,
    body: { success: false, error: message },
  }),

  /**
   * Return invalid signature response
   */
  invalidSignature: () => ({
    status: 401,
    body: { success: false, error: "Invalid webhook signature" },
  }),

  /**
   * Return rate limit response
   */
  rateLimited: (retryAfter: number = 60) => ({
    status: 429,
    body: { success: false, error: "Too many webhook requests" },
    headers: { "Retry-After": retryAfter.toString() },
  }),
};
