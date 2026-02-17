const Product = require('../models/Product');
const Subscription = require('../models/Subscription');
const SubscriptionDelivery = require('../models/SubscriptionDelivery');
const SubscriptionPlan = require('../models/SubscriptionPlan');

/**
 * Calculate subscription pricing for a set of items
 * @param {Array} items - Array of { product (with variants), variantIndex, quantity }
 * @param {string} frequency - 'weekly' | 'biweekly' | 'monthly'
 * @param {string} lane - 'FRESH_CITY_ONLY' | 'SHELF_STABLE_NATIONAL'
 * @param {string} city - Delivery city name
 * @returns {{ subtotal, discountAmount, deliveryCharge, taxAmount, totalAmount }}
 */
function calculateSubscriptionPrice(items, frequency, lane, city) {
  // Sum up item prices
  let subtotal = 0;
  for (const item of items) {
    const variant = item.product.variants[item.variantIndex] || item.product.variants[0];
    subtotal += variant.price * item.quantity;
  }
  subtotal = Math.round(subtotal * 100) / 100;

  // 10% subscription discount
  const discountAmount = Math.round(subtotal * 0.10 * 100) / 100;

  // Delivery charge based on lane
  let deliveryCharge = 0;
  if (lane === 'FRESH_CITY_ONLY') {
    const afterDiscount = subtotal - discountAmount;
    deliveryCharge = afterDiscount > 499 ? 0 : 49;
  } else {
    // SHELF_STABLE_NATIONAL — flat ₹99 shipping
    deliveryCharge = 99;
  }

  // GST at 5%
  const taxableAmount = subtotal - discountAmount + deliveryCharge;
  const taxAmount = Math.round(taxableAmount * 0.05 * 100) / 100;

  const totalAmount = Math.round((taxableAmount + taxAmount) * 100) / 100;

  return {
    subtotal,
    discountAmount,
    deliveryCharge,
    taxAmount,
    totalAmount,
  };
}

/**
 * Suggest a basket of products based on health goal and preferences
 * @param {string} healthGoal - Nutrition tag to target (e.g. 'high_protein')
 * @param {Array<string>} exclusions - Dietary tags to exclude (e.g. ['contains-egg'])
 * @param {{ min: number, max: number }} budgetRange - Budget constraints
 * @param {string} lane - 'FRESH_CITY_ONLY' | 'SHELF_STABLE_NATIONAL'
 * @returns {Promise<Array<{ product, variantIndex: number, quantity: number }>>}
 */
async function suggestBasket(healthGoal, exclusions, budgetRange, lane) {
  const shelfLifeType = lane === 'FRESH_CITY_ONLY' ? 'fresh' : 'shelf_stable';

  // Query subscription-eligible products matching the lane's shelfLifeType
  const query = {
    subscriptionEligible: true,
    shelfLifeType,
    isActive: true,
  };

  // Match nutritionTags to healthGoal
  if (healthGoal) {
    query.nutritionTags = healthGoal;
  }

  // Exclude products with certain dietary tags
  if (exclusions && exclusions.length > 0) {
    query.dietaryTags = { $nin: exclusions };
  }

  const products = await Product.find(query)
    .sort({ 'ratings.average': -1 })
    .lean();

  // Pick items within budget
  const basket = [];
  let runningTotal = 0;
  const minBudget = budgetRange && budgetRange.min ? budgetRange.min : 0;
  const maxBudget = budgetRange && budgetRange.max ? budgetRange.max : Infinity;

  for (const product of products) {
    const variant = product.variants[0];
    if (!variant) continue;

    const candidateTotal = runningTotal + variant.price;
    if (candidateTotal > maxBudget) continue;

    basket.push({
      product,
      variantIndex: 0,
      quantity: 1,
    });
    runningTotal = candidateTotal;
  }

  return basket;
}

/**
 * Validate whether a product swap is allowed
 * @param {Object} subscription - Subscription document (populated with plan)
 * @param {string} oldProductId - ID of the product being replaced
 * @param {string} newProductId - ID of the replacement product
 * @returns {Promise<{ valid: boolean, message: string }>}
 */
async function validateSwap(subscription, oldProductId, newProductId) {
  const [oldProduct, newProduct] = await Promise.all([
    Product.findById(oldProductId).lean(),
    Product.findById(newProductId).lean(),
  ]);

  if (!oldProduct) {
    return { valid: false, message: 'Original product not found' };
  }

  if (!newProduct) {
    return { valid: false, message: 'Replacement product not found' };
  }

  if (!newProduct.subscriptionEligible) {
    return { valid: false, message: 'Replacement product is not eligible for subscriptions' };
  }

  if (oldProduct.shelfLifeType !== newProduct.shelfLifeType) {
    return {
      valid: false,
      message: `Shelf life type mismatch: cannot swap ${oldProduct.shelfLifeType} for ${newProduct.shelfLifeType}`,
    };
  }

  // Check swap rules from the plan
  if (subscription.plan) {
    const plan = typeof subscription.plan === 'object' && subscription.plan.swapRules
      ? subscription.plan
      : await SubscriptionPlan.findById(subscription.plan).lean();

    if (plan && plan.swapRules) {
      const maxSwaps = plan.swapRules.maxSwapsPerCycle || 2;

      // Count existing swaps in current items
      const currentSwapCount = subscription.items.filter((item) => item.isSwapped).length;
      if (currentSwapCount >= maxSwaps) {
        return {
          valid: false,
          message: `Maximum swaps per cycle reached (${maxSwaps}). Cannot swap more items.`,
        };
      }
    }
  }

  return { valid: true, message: 'Swap is valid' };
}

/**
 * Calculate the next delivery date based on frequency and preferred day
 * @param {string} frequency - 'weekly' | 'biweekly' | 'monthly'
 * @param {number} preferredDay - Preferred day of week (0 = Sunday, 6 = Saturday)
 * @param {Date} fromDate - Starting date for calculation
 * @returns {Date}
 */
function getNextDeliveryDate(frequency, preferredDay, fromDate) {
  const start = fromDate ? new Date(fromDate) : new Date();
  let nextDate = new Date(start);

  // Advance based on frequency
  if (frequency === 'weekly') {
    nextDate.setDate(nextDate.getDate() + 7);
  } else if (frequency === 'biweekly') {
    nextDate.setDate(nextDate.getDate() + 14);
  } else if (frequency === 'monthly') {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }

  // Adjust to preferred day of week if specified
  if (preferredDay !== undefined && preferredDay !== null) {
    const currentDay = nextDate.getDay();
    let daysUntilPreferred = preferredDay - currentDay;
    if (daysUntilPreferred < 0) {
      daysUntilPreferred += 7;
    }
    // If daysUntilPreferred is 0 and we're already past the preferred day, keep it
    nextDate.setDate(nextDate.getDate() + daysUntilPreferred);
  }

  return nextDate;
}

/**
 * Generate upcoming delivery documents for a subscription
 * @param {Object} subscription - Subscription document (populated with items and plan)
 * @param {number} count - Number of deliveries to generate
 * @returns {Promise<Array>} Created SubscriptionDelivery documents
 */
async function generateUpcomingDeliveries(subscription, count) {
  const deliveries = [];
  let currentDate = new Date(subscription.nextDeliveryDate);

  // Get cutoff hours from plan or default to 24h
  let cutoffHours = 24;
  if (subscription.plan) {
    const plan = typeof subscription.plan === 'object' && subscription.plan.cutoffHoursBeforeDelivery
      ? subscription.plan
      : await SubscriptionPlan.findById(subscription.plan).lean();

    if (plan && plan.cutoffHoursBeforeDelivery) {
      cutoffHours = plan.cutoffHoursBeforeDelivery;
    }
  }

  // Snapshot items with product details
  const populatedItems = [];
  for (const item of subscription.items) {
    const product = typeof item.product === 'object' && item.product.name
      ? item.product
      : await Product.findById(item.product).lean();

    const primaryImage = product && product.images
      ? product.images.find((img) => img.isPrimary) || product.images[0]
      : null;

    populatedItems.push({
      product: product ? product._id : item.product,
      variantIndex: item.variantIndex,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      productName: product ? product.name : 'Unknown Product',
      productImage: primaryImage ? primaryImage.url : '',
    });
  }

  // Compute pricing from subscription
  const pricing = {
    subtotal: subscription.subtotal,
    deliveryCharge: subscription.deliveryCharge,
    discountAmount: subscription.discountAmount,
    taxAmount: subscription.taxAmount,
    totalAmount: subscription.totalAmount,
  };

  for (let i = 0; i < count; i++) {
    const scheduledDate = new Date(currentDate);

    // Edit cutoff: cutoffHours before delivery
    const editCutoffAt = new Date(scheduledDate);
    editCutoffAt.setHours(editCutoffAt.getHours() - cutoffHours);

    const delivery = await SubscriptionDelivery.create({
      subscription: subscription._id,
      user: subscription.user,
      deliveryNumber: subscription.totalDeliveries + i + 1,
      items: populatedItems,
      scheduledDate,
      deliverySlot: subscription.preferredTimeSlot || {},
      subtotal: pricing.subtotal,
      deliveryCharge: pricing.deliveryCharge,
      discountAmount: pricing.discountAmount,
      taxAmount: pricing.taxAmount,
      totalAmount: pricing.totalAmount,
      deliveryAddress: subscription.deliveryAddress,
      status: 'upcoming',
      editCutoffAt,
      isSkipped: false,
    });

    deliveries.push(delivery);

    // Advance to next delivery date
    currentDate = getNextDeliveryDate(
      subscription.frequency,
      subscription.preferredDeliveryDay,
      currentDate
    );
  }

  return deliveries;
}

/**
 * Process a delivery skip request
 * @param {{ deliveryId: string, userId: string, reason?: string }} params
 * @returns {Promise<Object>} Updated delivery document
 */
async function processSkip({ deliveryId, userId, reason }) {
  const delivery = await SubscriptionDelivery.findById(deliveryId);

  if (!delivery) {
    throw new Error('Delivery not found');
  }

  if (delivery.user.toString() !== userId.toString()) {
    throw new Error('Unauthorized: delivery does not belong to this user');
  }

  if (delivery.status !== 'upcoming') {
    throw new Error(`Cannot skip delivery with status "${delivery.status}". Only upcoming deliveries can be skipped.`);
  }

  const now = new Date();
  if (now >= delivery.editCutoffAt) {
    throw new Error('Cannot skip delivery: edit cutoff has passed');
  }

  // Mark delivery as skipped
  delivery.status = 'skipped';
  delivery.isSkipped = true;
  if (reason) delivery.skipReason = reason;
  await delivery.save();

  // Increment skippedDeliveries on the subscription
  await Subscription.findByIdAndUpdate(delivery.subscription, {
    $inc: { skippedDeliveries: 1 },
  });

  return delivery;
}

/**
 * Recalculate pricing for a subscription from its current items and save
 * @param {Object} subscription - Subscription document (must be a Mongoose document, not lean)
 * @returns {Promise<Object>} Updated subscription
 */
async function recalculatePricing(subscription) {
  // Populate products for items if not already populated
  const itemsWithProducts = [];
  for (const item of subscription.items) {
    const product = typeof item.product === 'object' && item.product.variants
      ? item.product
      : await Product.findById(item.product).lean();

    itemsWithProducts.push({
      product,
      variantIndex: item.variantIndex,
      quantity: item.quantity,
    });
  }

  const city = subscription.deliveryAddress ? subscription.deliveryAddress.city : '';
  const pricing = calculateSubscriptionPrice(
    itemsWithProducts,
    subscription.frequency,
    subscription.lane,
    city
  );

  subscription.subtotal = pricing.subtotal;
  subscription.discountAmount = pricing.discountAmount;
  subscription.deliveryCharge = pricing.deliveryCharge;
  subscription.taxAmount = pricing.taxAmount;
  subscription.totalAmount = pricing.totalAmount;

  await subscription.save();

  return subscription;
}

/**
 * Calculate pricing — object-based wrapper used by controllers
 * @param {{ items: Array, frequency: string, lane: string, city?: string }} params
 */
function calculatePricing({ items, frequency, lane, city }) {
  return calculateSubscriptionPrice(items, frequency, lane, city || '');
}

/**
 * Suggest basket — object-based wrapper used by controllers
 * @param {{ healthGoal: string, dietaryExclusions: string[], budgetRange: object, lane: string }} params
 */
async function suggestBasketFromParams({ healthGoal, dietaryExclusions, budgetRange, lane }) {
  return suggestBasket(healthGoal, dietaryExclusions, budgetRange, lane);
}

/**
 * Generate a single next delivery for a subscription (used by webhook on charge)
 * @param {Object} subscription - Subscription document
 * @returns {Promise<Array>} Created delivery documents
 */
async function generateNextDelivery(subscription) {
  return generateUpcomingDeliveries(subscription, 1);
}

/**
 * Delete upcoming deliveries and regenerate them (used after frequency/slot change)
 * @param {Object} subscription - Subscription document
 * @returns {Promise<Array>} Newly created delivery documents
 */
async function regenerateUpcomingDeliveries(subscription) {
  // Remove existing upcoming deliveries
  await SubscriptionDelivery.deleteMany({
    subscription: subscription._id,
    status: 'upcoming',
  });

  // Recalculate next delivery date from now
  subscription.nextDeliveryDate = getNextDeliveryDate(
    subscription.frequency,
    subscription.preferredDeliveryDay,
    new Date()
  );
  await subscription.save();

  // Generate 3 upcoming deliveries
  return generateUpcomingDeliveries(subscription, 3);
}

module.exports = {
  calculateSubscriptionPrice,
  calculatePricing,
  suggestBasket: suggestBasketFromParams,
  validateSwap,
  getNextDeliveryDate,
  generateUpcomingDeliveries,
  generateNextDelivery,
  regenerateUpcomingDeliveries,
  processSkip,
  recalculatePricing,
};
