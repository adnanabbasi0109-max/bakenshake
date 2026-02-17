const CustomCakeOrder = require('../models/CustomCakeOrder');
const { generateCakePreview, calculateCakePrice } = require('../services/cake-ai.service');

const MAX_AI_GENERATIONS = 3;

// POST /api/custom-cakes/generate-preview
exports.generatePreview = async (req, res, next) => {
  try {
    const { specifications } = req.body;

    if (!specifications || !specifications.shape || !specifications.flavor || !specifications.frostingType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required specifications (shape, flavor, frostingType)',
      });
    }

    // Calculate price
    const pricing = calculateCakePrice(specifications);

    // Generate AI preview
    const result = await generateCakePreview(specifications);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: result.error || 'Failed to generate preview',
        pricing,
      });
    }

    res.json({
      success: true,
      data: {
        imageUrl: result.imageUrl,
        prompt: result.prompt,
        pricing,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/custom-cakes/create
exports.createOrder = async (req, res, next) => {
  try {
    const { specifications, aiPreviewImageUrl, customerNotes } = req.body;

    if (!specifications) {
      return res.status(400).json({
        success: false,
        message: 'Specifications are required',
      });
    }

    const pricing = calculateCakePrice(specifications);

    const order = await CustomCakeOrder.create({
      userId: req.user?._id,
      specifications,
      aiPreviewImageUrl,
      calculatedPrice: pricing.total,
      customerNotes,
      status: 'pending_review',
    });

    res.status(201).json({
      success: true,
      data: order,
      pricing,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/custom-cakes/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await CustomCakeOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Custom cake order not found' });
    }

    // Only allow the owner or admin to view
    if (req.user && order.userId && order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// GET /api/custom-cakes/my-orders
exports.getMyOrders = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Login required to view orders' });
    }

    const orders = await CustomCakeOrder.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

// POST /api/custom-cakes/calculate-price
exports.calculatePrice = async (req, res, next) => {
  try {
    const { specifications } = req.body;

    if (!specifications) {
      return res.status(400).json({ success: false, message: 'Specifications are required' });
    }

    const pricing = calculateCakePrice(specifications);

    res.json({ success: true, data: pricing });
  } catch (error) {
    next(error);
  }
};
