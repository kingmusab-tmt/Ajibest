/**
 * CSRF Token Generation API Endpoint
 *
 * Provides CSRF tokens for authenticated users to protect sensitive operations.
 * Tokens are single-use and expire after 1 hour.
 *
 * @endpoint GET /api/csrf
 * @authentication Required
 * @returns {csrfToken: string, expiresIn: number}
 *
 * @example
 * ```typescript
 * // Client-side usage
 * const response = await fetch('/api/csrf');
 * const { csrfToken } = await response.json();
 *
 * // Use token in subsequent requests
 * fetch('/api/payment/verify', {
 *   method: 'POST',
 *   headers: {
 *     'X-CSRF-Token': csrfToken,
 *     'Content-Type': 'application/json',
 *   },
 *   body: JSON.stringify(paymentData),
 * });
 * ```
 */

import { NextRequest } from "next/server";
import { generateCSRFToken } from "@/utils/csrfProtection";

export async function GET(req: NextRequest) {
  return generateCSRFToken(req);
}
