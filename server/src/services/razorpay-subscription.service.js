const Razorpay = require('razorpay');
const crypto = require('crypto');
const env = require('../config/env');

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay plan for recurring billing
 * @param {string} name - Plan display name
 * @param {number} amount - Amount in paise (e.g. 50000 = ₹500)
 * @param {string} period - Billing period: 'daily' | 'weekly' | 'monthly' | 'yearly'
 * @param {number} interval - Number of periods between charges (e.g. 2 with 'weekly' = biweekly)
 * @returns {Promise<Object>} Razorpay plan object
 */
async function createPlan(name, amount, period, interval) {
  const plan = await razorpay.plans.create({
    period,
    interval,
    item: {
      name,
      amount,
      currency: 'INR',
    },
  });
  return plan;
}

/**
 * Create a Razorpay subscription for a customer
 * Accepts either positional args or a single options object
 * @param {string|Object} planIdOrOpts - Razorpay plan ID, or { planId, totalAmount, userId, frequency }
 * @param {number} [totalCount] - Total number of billing cycles
 * @param {number} [startAt] - Subscription start time as Unix timestamp (seconds)
 * @param {Object} [notes] - Key-value metadata
 * @returns {Promise<Object>} Razorpay subscription object with keyId added
 */
async function createSubscription(planIdOrOpts, totalCount, startAt, notes) {
  let planId;
  let count = totalCount;
  let start = startAt;
  let meta = notes;

  if (typeof planIdOrOpts === 'object' && planIdOrOpts !== null) {
    planId = planIdOrOpts.planId;
    count = planIdOrOpts.totalCount || 12;
    start = planIdOrOpts.startAt;
    meta = { userId: String(planIdOrOpts.userId || ''), frequency: planIdOrOpts.frequency || '' };
  } else {
    planId = planIdOrOpts;
  }

  const params = {
    plan_id: planId,
    total_count: count || 12,
    customer_notify: 1,
    notes: meta || {},
  };
  if (start) params.start_at = start;

  const subscription = await razorpay.subscriptions.create(params);
  subscription.keyId = env.RAZORPAY_KEY_ID;
  return subscription;
}

/**
 * Cancel a Razorpay subscription
 * @param {string} subscriptionId - Razorpay subscription ID
 * @param {boolean} cancelAtCycleEnd - If true, cancel at end of current billing cycle
 * @returns {Promise<Object>} Cancelled subscription object
 */
async function cancelSubscription(subscriptionId, cancelAtCycleEnd) {
  const result = await razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd);
  return result;
}

/**
 * Pause a Razorpay subscription
 * @param {string} subscriptionId - Razorpay subscription ID
 * @returns {Promise<Object>} Paused subscription object
 */
async function pauseSubscription(subscriptionId) {
  const result = await razorpay.subscriptions.pause(subscriptionId);
  return result;
}

/**
 * Resume a paused Razorpay subscription
 * @param {string} subscriptionId - Razorpay subscription ID
 * @returns {Promise<Object>} Resumed subscription object
 */
async function resumeSubscription(subscriptionId) {
  const result = await razorpay.subscriptions.resume(subscriptionId);
  return result;
}

/**
 * Verify a Razorpay webhook signature
 * @param {string|Buffer} rawBody - Raw request body
 * @param {string} signature - X-Razorpay-Signature header value
 * @returns {boolean} True if signature is valid
 */
function verifyWebhookSignature(rawBody, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  return expectedSignature === signature;
}

module.exports = {
  createPlan,
  createSubscription,
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
  verifyWebhookSignature,
};
