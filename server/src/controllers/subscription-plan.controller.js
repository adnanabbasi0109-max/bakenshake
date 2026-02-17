const SubscriptionPlan = require('../models/SubscriptionPlan');
const Product = require('../models/Product');

// GET /api/subscription-plans
exports.getPlans = async (req, res, next) => {
  try {
    const { lane, city, tags, featured } = req.query;

    const filter = { isActive: true };

    if (lane) filter.lane = lane;

    if (city) {
      filter.$or = [
        { availableInCities: { $in: [city] } },
        { isPanIndia: true },
      ];
    }

    if (tags) {
      filter.targetNutritionTags = { $in: tags.split(',') };
    }

    if (featured === 'true') filter.isFeatured = true;

    const plans = await SubscriptionPlan.find(filter)
      .populate('items.product', 'name slug images variants dietaryTags')
      .sort({ sortOrder: 1 });

    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

// GET /api/subscription-plans/featured
exports.getFeaturedPlans = async (req, res, next) => {
  try {
    const { lane, city, tags } = req.query;

    const filter = { isActive: true, isFeatured: true };

    if (lane) filter.lane = lane;

    if (city) {
      filter.$or = [
        { availableInCities: { $in: [city] } },
        { isPanIndia: true },
      ];
    }

    if (tags) {
      filter.targetNutritionTags = { $in: tags.split(',') };
    }

    const plans = await SubscriptionPlan.find(filter)
      .populate('items.product', 'name slug images variants dietaryTags')
      .sort({ sortOrder: 1 })
      .limit(6);

    res.json({ success: true, data: plans });
  } catch (error) {
    next(error);
  }
};

// GET /api/subscription-plans/:slug
exports.getPlanBySlug = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate('items.product');

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found' });
    }

    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// GET /api/subscription-plans/:slug/swap-options?productId=xxx
exports.getSwapOptions = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found' });
    }

    const { productId } = req.query;
    const swapRules = plan.swapRules || {};

    // Find the current product to determine its shelfLifeType
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const productFilter = {
      isActive: true,
      subscriptionEligible: true,
      _id: { $ne: productId },
    };

    // Match shelfLifeType
    if (currentProduct.shelfLifeType) {
      productFilter.shelfLifeType = currentProduct.shelfLifeType;
    }

    // If swap rules specify required tags, filter by them
    if (swapRules.requiredTags && swapRules.requiredTags.length > 0) {
      productFilter.nutritionTags = { $in: swapRules.requiredTags };
    }

    const swapOptions = await Product.find(productFilter)
      .select('name slug images variants dietaryTags nutritionTags shelfLifeType')
      .limit(20);

    res.json({ success: true, data: swapOptions });
  } catch (error) {
    next(error);
  }
};

// POST /api/subscription-plans (Admin)
exports.createPlan = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.create(req.body);

    res.status(201).json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscription-plans/:id (Admin)
exports.updatePlan = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found' });
    }

    res.json({ success: true, data: plan });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/subscription-plans/:id (Admin)
exports.deletePlan = async (req, res, next) => {
  try {
    const plan = await SubscriptionPlan.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!plan) {
      return res.status(404).json({ success: false, message: 'Subscription plan not found' });
    }

    res.json({ success: true, message: 'Subscription plan deactivated' });
  } catch (error) {
    next(error);
  }
};
