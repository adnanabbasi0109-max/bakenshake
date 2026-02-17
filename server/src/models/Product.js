const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: String,
  weight: String,
  price: { type: Number, required: true },
  compareAtPrice: Number,
  sku: String,
  inStock: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: String,
    shortDescription: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: String,
    images: [
      {
        url: { type: String, required: true },
        alt: String,
        isPrimary: { type: Boolean, default: false },
      },
    ],
    variants: [variantSchema],
    dietaryTags: [
      {
        type: String,
        enum: ['veg', 'eggless', 'contains-egg', 'non-veg'],
      },
    ],
    isShippable: { type: Boolean, default: false },
    availableInCities: [
      {
        type: String,
        enum: ['Bhopal', 'Indore', 'Gwalior'],
      },
    ],
    shelfLife: String,
    ingredients: String,

    // Subscription fields
    subscriptionEligible: { type: Boolean, default: false },
    nutritionTags: [
      {
        type: String,
        enum: [
          'high_protein', 'low_sugar', 'low_carb', 'high_fiber',
          'keto_friendly', 'gluten_free', 'sugar_free', 'whole_grain',
          'low_calorie', 'vegan', 'organic',
        ],
      },
    ],
    shelfLifeType: {
      type: String,
      enum: ['fresh', 'shelf_stable'],
    },
    subscriptionDiscountPercent: { type: Number, default: 10, min: 0, max: 50 },
    maxSubscriptionQty: { type: Number, default: 5 },

    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', shortDescription: 'text' });
productSchema.index({ slug: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ subscriptionEligible: 1, shelfLifeType: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);
