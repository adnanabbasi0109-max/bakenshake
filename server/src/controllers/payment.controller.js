const Razorpay = require('razorpay');
const crypto = require('crypto');
const env = require('../config/env');

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

/**
 * POST /api/payment/create-order
 * Body: { amount } — amount in paise (e.g. 50000 = ₹500)
 * Returns: { orderId, keyId } for frontend to open Razorpay Checkout
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const amountPaise = Math.round(Number(amount));
    if (!amountPaise || amountPaise < 100) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must be at least 100 paise (₹1)',
      });
    }
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    res.json({
      success: true,
      orderId: order.id,
      keyId: env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/payment/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Verifies the payment signature and returns success/failure.
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing razorpay_order_id, razorpay_payment_id or razorpay_signature',
      });
    }
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    const isValid = expectedSignature === razorpay_signature;
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
    res.json({
      success: true,
      message: 'Payment verified successfully',
      razorpay_order_id,
      razorpay_payment_id,
    });
  } catch (error) {
    next(error);
  }
};
