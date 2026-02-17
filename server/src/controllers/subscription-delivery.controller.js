const SubscriptionDelivery = require('../models/SubscriptionDelivery');
const Subscription = require('../models/Subscription');
const Product = require('../models/Product');
const subscriptionService = require('../services/subscription.service');

const Razorpay = require('razorpay');
const env = require('../config/env');

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

// GET /api/subscription-deliveries/upcoming
exports.getUpcomingDeliveries = async (req, res, next) => {
  try {
    const deliveries = await SubscriptionDelivery.find({
      user: req.user._id,
      status: { $in: ['upcoming', 'locked', 'payment_pending', 'paid', 'preparing'] },
    }).sort({ scheduledDate: 1 });

    res.json({ success: true, data: deliveries });
  } catch (error) {
    next(error);
  }
};

// GET /api/subscription-deliveries/:id
exports.getDelivery = async (req, res, next) => {
  try {
    const delivery = await SubscriptionDelivery.findById(req.params.id)
      .populate('items.product');

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    if (delivery.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: delivery });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscription-deliveries/:id/skip
exports.skipDelivery = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const result = await subscriptionService.processSkip({
      deliveryId: req.params.id,
      userId: req.user._id,
      reason,
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscription-deliveries/:id/unskip
exports.unskipDelivery = async (req, res, next) => {
  try {
    const delivery = await SubscriptionDelivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    if (delivery.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!delivery.isSkipped) {
      return res.status(400).json({ success: false, message: 'Delivery is not skipped' });
    }

    // Check edit cutoff
    if (new Date() >= delivery.editCutoffAt) {
      return res.status(400).json({ success: false, message: 'Edit cutoff has passed' });
    }

    delivery.isSkipped = false;
    delivery.status = 'upcoming';
    await delivery.save();

    // Decrement skipped count on subscription
    await Subscription.findByIdAndUpdate(delivery.subscription, {
      $inc: { skippedDeliveries: -1 },
    });

    res.json({ success: true, data: delivery });
  } catch (error) {
    next(error);
  }
};

// PUT /api/subscription-deliveries/:id/swap
exports.swapItem = async (req, res, next) => {
  try {
    const { oldProductId, newProductId, newVariantIndex = 0 } = req.body;

    const delivery = await SubscriptionDelivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    if (delivery.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Check edit cutoff
    if (new Date() >= delivery.editCutoffAt) {
      return res.status(400).json({ success: false, message: 'Edit cutoff has passed' });
    }

    if (delivery.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Delivery cannot be modified' });
    }

    // Load the new product and verify eligibility
    const newProduct = await Product.findById(newProductId);
    if (!newProduct) {
      return res.status(404).json({ success: false, message: 'New product not found' });
    }

    if (!newProduct.subscriptionEligible) {
      return res.status(400).json({ success: false, message: 'Product is not subscription eligible' });
    }

    // Verify same shelfLifeType
    const oldProduct = await Product.findById(oldProductId);
    if (oldProduct && oldProduct.shelfLifeType !== newProduct.shelfLifeType) {
      return res.status(400).json({ success: false, message: 'New product must have the same shelf life type' });
    }

    // Find and replace the item in the delivery
    const itemIndex = delivery.items.findIndex(
      (item) => item.product.toString() === oldProductId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: 'Item not found in delivery' });
    }

    const newVariant = newProduct.variants[newVariantIndex] || newProduct.variants[0];

    delivery.items[itemIndex].product = newProduct._id;
    delivery.items[itemIndex].variantIndex = newVariantIndex;
    delivery.items[itemIndex].unitPrice = newVariant.price;
    delivery.items[itemIndex].productName = newProduct.name;
    delivery.items[itemIndex].productImage =
      newProduct.images && newProduct.images.length > 0
        ? newProduct.images[0].url
        : undefined;

    // Recalculate delivery pricing
    let subtotal = 0;
    for (const item of delivery.items) {
      subtotal += item.unitPrice * item.quantity;
    }
    delivery.subtotal = subtotal;
    delivery.totalAmount = subtotal + delivery.deliveryCharge - delivery.discountAmount + delivery.taxAmount;

    await delivery.save();

    res.json({ success: true, data: delivery });
  } catch (error) {
    next(error);
  }
};

// POST /api/subscription-deliveries/:id/pay
exports.payManual = async (req, res, next) => {
  try {
    const delivery = await SubscriptionDelivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ success: false, message: 'Delivery not found' });
    }

    if (delivery.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const amountPaise = Math.round(delivery.totalAmount * 100);
    if (!amountPaise || amountPaise < 100) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required and must be at least 100 paise (₹1)',
      });
    }

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `sub_del_${delivery._id}_${Date.now()}`,
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
