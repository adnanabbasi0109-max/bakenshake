const mongoose = require('mongoose');

const subscriptionItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantIndex: { type: Number, default: 0 },
  quantity: { type: Number, default: 1, min: 1 },
  unitPrice: { type: Number, required: true },
  isSwapped: { type: Boolean, default: false },
  originalProduct: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
});

const subscriptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    subscriptionType: {
      type: String,
      enum: ['curated_plan', 'build_your_own', 'single_product'],
      required: true,
    },

    plan: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },

    lane: {
      type: String,
      enum: ['FRESH_CITY_ONLY', 'SHELF_STABLE_NATIONAL'],
      required: true,
    },

    items: [subscriptionItemSchema],

    // Schedule
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly'],
      required: true,
    },
    preferredDeliveryDay: { type: Number, min: 0, max: 6 },
    preferredTimeSlot: {
      start: String,
      end: String,
    },
    nextDeliveryDate: { type: Date },

    // Delivery address (embedded snapshot)
    deliveryAddress: {
      label: String,
      line1: { type: String, required: true },
      line2: String,
      city: { type: String, required: true },
      state: { type: String, default: 'Madhya Pradesh' },
      pincode: { type: String, required: true },
      lat: Number,
      lng: Number,
    },

    // Pricing
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // Status
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled', 'payment_failed', 'pending_setup'],
      default: 'pending_setup',
    },
    pausedUntil: Date,
    cancelledAt: Date,
    cancelReason: String,

    // Payment
    paymentMethod: {
      type: String,
      enum: ['razorpay_autopay', 'manual_per_delivery'],
      default: 'razorpay_autopay',
    },
    razorpaySubscriptionId: String,
    razorpayPlanId: String,
    razorpayCustomerId: String,

    // Tracking
    totalDeliveries: { type: Number, default: 0 },
    skippedDeliveries: { type: Number, default: 0 },

    // Build-your-own specifics
    healthGoal: String,
    dietaryExclusions: [String],
    budgetRange: {
      min: Number,
      max: Number,
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ status: 1, nextDeliveryDate: 1 });
subscriptionSchema.index({ razorpaySubscriptionId: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
