const Subscription = require('../models/Subscription');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const Product = require('../models/Product');
const subscriptionService = require('../services/subscription.service');
const razorpayService = require('../services/razorpay-subscription.service');

// POST /api/subscriptions
exports.createSubscription = async (req, res, next) => {
  try {
    const {
      planSlug,
      subscriptionType,
      lane,
      items,
      frequency,
      preferredDeliveryDay,
      preferredTimeSlot,
      deliveryAddress,
      paymentMethod,
      healthGoal,
      dietaryExclusions,
      budgetRange,
    } = req.body;

    let subscriptionItems = items || [];
    let plan = null;

    // If curated plan, load the plan and copy items with product prices
    if (subscriptionType === 'curated_plan') {
      plan = await SubscriptionPlan.findOne({ slug: planSlug, isActive: true })
        .populate('items.product');

      if (!plan) {
        return res.status(404).json({ success: false, message: 'Subscription plan not found' });
      }

      subscriptionItems = plan.items.map((item) => ({
        product: item.product._id,
        variantIndex: item.variantIndex,
        quantity: item.quantity,
        unitPrice: item.product.variants[item.variantIndex]
          ? item.product.variants[item.variantIndex].price
          : item.product.variants[0].price,
      }));
    }

    // Calculate pricing via subscription service
    const pricing = await subscriptionService.calculatePricing({
      items: subscriptionItems,
      frequency,
      lane,
    });

    // Create Razorpay subscription if autopay
    let razorpaySubscriptionId = null;
    let razorpayKeyId = null;
    if (paymentMethod === 'razorpay_autopay') {
      const rzpSubscription = await razorpayService.createSubscription({
        planId: plan
          ? plan.razorpayPlanIds[frequency]
          : null,
        totalAmount: pricing.totalAmount,
        userId: req.user._id,
        frequency,
      });
      razorpaySubscriptionId = rzpSubscription.id;
      razorpayKeyId = rzpSubscription.keyId;
    }

    // Create the subscription document
    const subscription = await Subscription.create({
      user: req.user._id,
      subscriptionType,
      plan: plan ? plan._id : undefined,
      lane,
      items: subscriptionItems,
      frequency,
      preferredDeliveryDay,
      preferredTimeSlot,
      deliveryAddress,
      subtotal: pricing.subtotal,
      deliveryCharge: pricing.deliveryCharge,
      discountAmount: pricing.discountAmount,
      taxAmount: pricing.taxAmount,
      totalAmount: pricing.totalAmount,
      status: 'pending_setup',
      paymentMethod: paymentMethod || 'razorpay_autopay',
      razorpaySubscriptionId,
      healthGoal,
      dietaryExclusions,
      budgetRange,
    });

    // Generate first 3 upcoming deliveries
    await subscriptionService.generateUpcomingDeliveries(subscription, 3);

    res.status(201).json({
      success: true,
      data: subscription,
      razorpaySubscriptionId,
      keyId: razorpayKeyId,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/subscriptions/my
exports.getMySubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
      .populate('plan', 'name slug image')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

// GET /api/subscriptions/:id
exports.getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id)
      .populate('plan')
      .populate('items.product');

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscriptions/:id/pause
exports.pauseSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (subscription.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Subscription is not active' });
    }

    subscription.status = 'paused';
    await subscription.save();

    // Pause Razorpay subscription if autopay
    if (subscription.paymentMethod === 'razorpay_autopay' && subscription.razorpaySubscriptionId) {
      await razorpayService.pauseSubscription(subscription.razorpaySubscriptionId);
    }

    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscriptions/:id/resume
exports.resumeSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (subscription.status !== 'paused') {
      return res.status(400).json({ success: false, message: 'Subscription is not paused' });
    }

    subscription.status = 'active';
    subscription.pausedUntil = undefined;
    await subscription.save();

    // Resume Razorpay subscription if autopay
    if (subscription.paymentMethod === 'razorpay_autopay' && subscription.razorpaySubscriptionId) {
      await razorpayService.resumeSubscription(subscription.razorpaySubscriptionId);
    }

    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscriptions/:id/cancel
exports.cancelSubscription = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancelReason = reason;
    await subscription.save();

    // Cancel upcoming deliveries
    const SubscriptionDelivery = require('../models/SubscriptionDelivery');
    await SubscriptionDelivery.updateMany(
      {
        subscription: subscription._id,
        status: { $in: ['upcoming', 'locked', 'payment_pending'] },
      },
      { status: 'cancelled' }
    );

    // Cancel Razorpay subscription if autopay
    if (subscription.paymentMethod === 'razorpay_autopay' && subscription.razorpaySubscriptionId) {
      await razorpayService.cancelSubscription(subscription.razorpaySubscriptionId);
    }

    // Decrement plan subscriber count
    if (subscription.plan) {
      await SubscriptionPlan.findByIdAndUpdate(subscription.plan, {
        $inc: { subscriberCount: -1 },
      });
    }

    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscriptions/:id/frequency
exports.changeFrequency = async (req, res, next) => {
  try {
    const { frequency } = req.body;
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    subscription.frequency = frequency;

    // Recalculate pricing
    const pricing = await subscriptionService.calculatePricing({
      items: subscription.items,
      frequency,
      lane: subscription.lane,
    });

    subscription.subtotal = pricing.subtotal;
    subscription.deliveryCharge = pricing.deliveryCharge;
    subscription.discountAmount = pricing.discountAmount;
    subscription.taxAmount = pricing.taxAmount;
    subscription.totalAmount = pricing.totalAmount;
    await subscription.save();

    // Regenerate upcoming deliveries
    await subscriptionService.regenerateUpcomingDeliveries(subscription);

    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscriptions/:id/address
exports.updateAddress = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    subscription.deliveryAddress = req.body;
    await subscription.save();

    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscriptions/:id/slot
exports.updateSlot = async (req, res, next) => {
  try {
    const { preferredDeliveryDay, preferredTimeSlot } = req.body;
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (preferredDeliveryDay !== undefined) subscription.preferredDeliveryDay = preferredDeliveryDay;
    if (preferredTimeSlot) subscription.preferredTimeSlot = preferredTimeSlot;
    await subscription.save();

    res.json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

// POST /api/subscriptions/suggest-basket
exports.suggestBasket = async (req, res, next) => {
  try {
    const { healthGoal, dietaryExclusions, budgetRange, lane } = req.body;

    const suggestions = await subscriptionService.suggestBasket({
      healthGoal,
      dietaryExclusions,
      budgetRange,
      lane,
    });

    res.json({ success: true, data: suggestions });
  } catch (error) {
    next(error);
  }
};

// GET /api/subscriptions/eligible-products
exports.getEligibleProducts = async (req, res, next) => {
  try {
    const { lane, tags, search, page = 1, limit = 20 } = req.query;

    const filter = { isActive: true, subscriptionEligible: true };

    if (lane) {
      const shelfLifeType = lane === 'FRESH_CITY_ONLY' ? 'fresh' : 'shelf_stable';
      filter.shelfLifeType = shelfLifeType;
    }

    if (tags) {
      filter.nutritionTags = { $in: tags.split(',') };
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};
