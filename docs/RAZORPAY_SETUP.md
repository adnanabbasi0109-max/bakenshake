# Razorpay Payment Gateway – Setup Guide

This guide walks you through adding Razorpay to the Bake n Shake project.

---

## Step 1: Create a Razorpay Account & Get API Keys

1. **Sign up** at [https://razorpay.com](https://razorpay.com) and log in to the [Dashboard](https://dashboard.razorpay.com).
2. **Activate your account** (complete KYC if required for live payments).
3. **Get API keys:**
   - Go to **Settings** → **API Keys** (or [direct link](https://dashboard.razorpay.com/app/keys)).
   - Click **Generate Key** if you don’t have one.
   - You’ll see:
     - **Key ID** (e.g. `rzp_test_xxxx`) – safe to use in the frontend.
     - **Key Secret** – use only on the server; never expose in the frontend or commit to git.

For testing, use **Test Mode** (keys that start with `rzp_test_`). For live payments, use **Live** keys (`rzp_live_...`).

---

## Step 2: Add Keys to Your `.env`

In **`server/.env`** set:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

Replace with your actual **Key ID** and **Key Secret** from the Razorpay dashboard.  
Restart the server after changing `.env`.

---

## Step 3: How It Works in This Project

| Step | Where | What happens |
|------|--------|--------------|
| 1 | Frontend (Checkout) | User clicks “Pay with Razorpay”. App calls your backend to **create a Razorpay order** (amount in paise). |
| 2 | Backend | Server uses Razorpay API to create an order and returns `orderId` and `keyId` to the frontend. |
| 3 | Frontend | Razorpay Checkout script opens; user pays (card/UPI/etc.). |
| 4 | Razorpay | After payment, Razorpay returns `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`. |
| 5 | Frontend | Sends these three to your backend **verify** endpoint. |
| 6 | Backend | Verifies the `signature` using `RAZORPAY_KEY_SECRET`, then marks the order as paid (e.g. in DB). |

**Important:** Always verify the payment on the server using the signature. Never trust only the frontend or redirect URL.

---

## Step 4: Backend APIs Used

- **`POST /api/payment/create-order`**  
  Body: `{ "amount": 50000 }` (amount in **paise**; 50000 = ₹500).  
  Returns: `{ "orderId": "order_xxx", "keyId": "rzp_test_xxx" }`.

- **`POST /api/payment/verify`**  
  Body: `{ "razorpay_order_id", "razorpay_payment_id", "razorpay_signature" }`.  
  Returns success/failure after signature verification.

---

## Step 5: Frontend (Checkout Page)

- **Razorpay script:** Load `https://checkout.razorpay.com/v1/checkout.js` in the checkout page.
- **Key ID:** Use the `keyId` returned from `create-order` (or your `RAZORPAY_KEY_ID` from an env-exposed variable like `NEXT_PUBLIC_RAZORPAY_KEY_ID` for the frontend).
- **Flow:**  
  1. Call `create-order` with cart total (in paise).  
  2. Open Razorpay with `order_id` and `key`.  
  3. In the `handler` (success callback), call `verify` with the three IDs and signature.  
  4. On success, show a thank-you page or redirect.

Amount in JavaScript must be in **paise** (e.g. `amount: 50000` for ₹500).

---

## Step 6: Test Cards (Test Mode)

When using **Test Mode** keys, you can use Razorpay’s [test cards](https://razorpay.com/docs/payments/payments/test-card-details/), e.g.:

- **Card:** `4111 1111 1111 1111`
- **Expiry:** any future date  
- **CVV:** any 3 digits  

No real money is charged in test mode.

---

## Summary Checklist

- [ ] Razorpay account created; Test (or Live) API keys generated.
- [ ] `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` set in `server/.env`.
- [ ] Server restarted; backend `create-order` and `verify` endpoints working.
- [ ] Checkout page loads Razorpay script and uses `create-order` → Razorpay Checkout → `verify`.
- [ ] Payment verified only on the server using the signature.

For more details, see [Razorpay Docs](https://razorpay.com/docs/).
