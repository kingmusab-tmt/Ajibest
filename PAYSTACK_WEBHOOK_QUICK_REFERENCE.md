# Paystack Webhook Implementation - Quick Reference

## 🚀 Quick Setup

### 1. Configure Environment

```bash
# .env.local
PAYSTACK_SECRET_KEY=sk_live_xxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
```

### 2. Get from Paystack Dashboard

1. Go to [dashboard.paystack.com](https://dashboard.paystack.com)
2. Settings → API Keys & Webhooks
3. Copy Secret Key → `PAYSTACK_SECRET_KEY`
4. Copy Public Key → `PAYSTACK_PUBLIC_KEY`

### 3. Configure Webhook URL

1. Paystack Dashboard → Settings → Webhooks
2. Set URL: `https://yourdomain.com/api/webhook`
3. Select events: Charge successful, Charge failed, Charge abandoned
4. Save

---

## 📊 How It Works

```
1. User initiates payment via Paystack
   ↓
2. Paystack processes payment
   ↓
3. Paystack sends webhook to: POST /api/webhook
   - Headers: x-paystack-signature
   - Body: JSON event data
   ↓
4. Our webhook handler:
   ✅ Extract signature from header
   ✅ Get raw request body
   ✅ Verify HMAC-SHA512 signature
   ✅ Validate JSON payload
   ✅ Route to event handler
   ✅ Update transaction in database
   ✅ Return 200 OK
   ↓
5. Transaction status updated:
   - charge.success → status: "successful"
   - charge.failed → status: "failed"
   - charge.abandoned → status: "canceled"
```

---

## 🔐 Security Features

✅ **Signature Verification**: HMAC-SHA512  
✅ **Timing Attack Prevention**: Constant-time comparison  
✅ **Payload Validation**: JSON schema validation  
✅ **Event Type Validation**: Enum-based validation  
✅ **Request Logging**: IP, user agent, timestamps  
✅ **Error Handling**: No data leakage on failures

---

## 📚 Key Functions

### Verify Signature

```typescript
import { verifyPaystackSignature } from "@/utils/webhookValidation";

const isValid = verifyPaystackSignature(
  rawBody,
  signatureFromHeader,
  PAYSTACK_SECRET_KEY,
);
```

### Validate Complete Webhook

```typescript
import { validatePaystackWebhook } from "@/utils/webhookValidation";

const validation = validatePaystackWebhook(rawBody, signatureHeader, secretKey);

if (!validation.isValid) {
  console.error(validation.error);
  return;
}

console.log(validation.event); // "charge.success"
console.log(validation.data); // Event data
```

### Process Event

```typescript
import { processChargeSuccessEvent } from "@/utils/webhookValidation";

const chargeData = processChargeSuccessEvent(event.data);
// Returns: { reference, amount, email, status, ... }
```

---

## 🧪 Testing

### Test Webhook with curl

```bash
# Get test webhook from Paystack Dashboard first

curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: YOUR_SIGNATURE" \
  -d '{
    "event": "charge.success",
    "data": {
      "reference": "test-ref-123",
      "amount": 50000,
      "email": "test@example.com",
      "status": "success"
    }
  }'

# Expected: 200 OK
# {"success":true,"message":"Webhook received"}
```

### Test Signature Verification

```typescript
import { verifyPaystackSignature } from "@/utils/webhookValidation";

// Create test payload
const payload = JSON.stringify({
  event: "charge.success",
  data: { reference: "test-123" },
});

// Compute signature (as Paystack would)
const hash = crypto
  .createHmac("sha512", PAYSTACK_SECRET_KEY)
  .update(payload)
  .digest("hex");

// Verify
const isValid = verifyPaystackSignature(payload, hash, PAYSTACK_SECRET_KEY);

console.log(isValid); // true
```

---

## 📊 Supported Events

| Event              | Handler        | Status                              |
| ------------------ | -------------- | ----------------------------------- |
| `charge.success`   | ✅ Implemented | Updates transaction to "successful" |
| `charge.failed`    | ✅ Implemented | Updates transaction to "failed"     |
| `charge.abandoned` | ✅ Implemented | Updates transaction to "canceled"   |
| `transfer.success` | Logged         | Ready to implement                  |
| `transfer.failed`  | Logged         | Ready to implement                  |
| `invoice.*`        | Logged         | Ready to implement                  |

---

## ⚡ Transaction Updates

### charge.success

```javascript
// Transaction updated:
{
  status: "successful",
  amount: 500,                    // 50000 kobo → 500 naira
  paymentMethod: "payOnce",
  description: "test@example.com" // Reference
}
```

### charge.failed

```javascript
// Transaction updated:
{
  status: "failed",
  description: "Payment failed: Insufficient funds"
}
```

### charge.abandoned

```javascript
// Transaction updated:
{
  status: "canceled",
  description: "Payment abandoned"
}
```

---

## 🛡️ Common Errors & Fixes

### Error: "Invalid webhook signature"

**Cause**: Signature verification failed  
**Fix**:

1. Verify `PAYSTACK_SECRET_KEY` is correct
2. Ensure webhook URL is public (accessible from Paystack)
3. Check `x-paystack-signature` header is present

### Error: "Missing event or data field"

**Cause**: Invalid Paystack payload  
**Fix**:

1. Check Paystack event format
2. Verify webhook configuration in Paystack Dashboard
3. Check Paystack logs for failed webhook attempts

### Error: "Unknown event type"

**Cause**: Unsupported event received  
**Fix**: Event logged but not processed (normal behavior)

### Webhooks not triggering

**Cause**: Webhook URL not accessible or not configured  
**Fix**:

1. Verify webhook URL in Paystack Dashboard
2. Ensure domain is public (not localhost)
3. Test with Paystack's webhook tester

---

## 🔗 Files

| File                           | Purpose                                   |
| ------------------------------ | ----------------------------------------- |
| `utils/webhookValidation.ts`   | Signature verification & event processing |
| `app/api/webhook/route.ts`     | Webhook endpoint handler                  |
| `PAYSTACK_WEBHOOK_SECURITY.md` | Complete documentation                    |

---

## 📚 References

- [Paystack Webhook Docs](https://paystack.com/docs/webhooks/events/)
- [Paystack Webhook Testing](https://paystack.com/docs/webhooks/test-webhook/)
- [Signature Verification](https://paystack.com/docs/webhooks/signature-verification/)

---

**Status:** ✅ Production-Ready  
**Audit Finding:** P2-4 - Incomplete Webhook Security ✅ RESOLVED
