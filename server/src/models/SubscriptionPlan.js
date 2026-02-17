const mongoose = require('mongoose');

const planItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantIndex: { type: Number, default: 0 },
  quantity: { type: Number, default: 1, min: 1 },
  isSwappable: { type: Boolean, default: true },
});

const swapRuleSchema = new mongoose.Schema({
  requiredTags: [String],
  mustMatchShelfLifeType: { type: Boolean, default: true },
  maxSwapsPerCycle: { type: Number, default: 2 },
});

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    shortDescription: String,
    image: String,
    bannerImage: String,

    planType: {
      type: String,
      enum: ['curated', 'build_your_own'],
      default: 'curated',
    },

    lane: {
      type: String,
      enum: ['FRESH_CITY_ONLY', 'SHELF_STABLE_NATIONAL'],
      required: true,
    },

    items: [planItemSchema],

    // Pricing per frequency
    priceWeekly: Number,
    priceBiweekly: Number,
    priceMonthly: Number,
    compareAtPriceMonthly: Number,

    allowedFrequencies: [
      {
        type: String,
        enum: ['weekly', 'biweekly', 'monthly'],
      },
    ],

    swapRules: swapRuleSchema,

    cutoffHoursBeforeDelivery: { type: Number, default: 24 },

    availableInCities: [
      {
        type: String,
        enum: ['Bhopal', 'Indore', 'Gwalior'],
      },
    ],
    isPanIndia: { type: Boolean, default: false },

    targetNutritionTags: [
      {
        type: String,
        enum: [
          'high_protein', 'low_sugar', 'low_carb', 'high_fiber',
          'keto_friendly', 'gluten_free', 'sugar_free', 'whole_grain',
          'low_calorie', 'vegan', 'organic',
        ],
      },
    ],

    // Razorpay Plan IDs per frequency
    razorpayPlanIds: {
      weekly: String,
      biweekly: String,
      monthly: String,
    },

    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    subscriberCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

subscriptionPlanSchema.index({ slug: 1 });
subscriptionPlanSchema.index({ lane: 1, isActive: 1 });
subscriptionPlanSchema.index({ isFeatured: 1, isActive: 1 });
subscriptionPlanSchema.index({ availableInCities: 1, isActive: 1 });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
