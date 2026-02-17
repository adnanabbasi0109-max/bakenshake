const Subscription = require('../models/Subscription');
const SubscriptionDelivery = require('../models/SubscriptionDelivery');
const razorpayService = require('../services/razorpay-subscription.service');
const subscriptionService = require('../services/subscription.service');

// POST /api/subscription-webhooks/razorpay
exports.handleWebhook = async (req, res, next) => {
  try {
    // Verify webhook signature
    const signature = req.headers['x-razorpay-signature'];
    const isValid = razorpayService.verifyWebhookSignature(req.body, signature);

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }

    const event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const eventType = event.event;
    const payload = event.payload;

    switch (eventType) {
      case 'subscription.activated': {
        const rzpSubscriptionId = payload.subscription.entity.id;
        const subscription = await Subscription.findOne({ razorpaySubscriptionId: rzpSubscriptionId });

        if (subscription) {
          subscription.status = 'active';
          await subscription.save();

          // Increment plan subscriber count
          if (subscription.plan) {
            const SubscriptionPlan = require('../models/SubscriptionPlan');
            await SubscriptionPlan.findByIdAndUpdate(subscription.plan, {
              $inc: { subscriberCount: 1 },
            });
          }
        }
        break;
      }

      case 'subscription.charged': {
        const rzpSubscriptionId = payload.subscription.entity.id;
        const paymentId = payload.payment.entity.id;
        const subscription = await Subscription.findOne({ razorpaySubscriptionId: rzpSubscriptionId });

        if (subscription) {
          // Mark latest upcoming delivery as paid
          const delivery = await SubscriptionDelivery.findOne({
            subscription: subscription._id,
            status: 'upcoming',
          }).sort({ scheduledDate: 1 });

          if (delivery) {
            delivery.status = 'paid';
            delivery.razorpayPaymentId = paymentId;
            delivery.paidAt = new Date();
            await delivery.save();
          }

          // Increment total deliveries
          subscription.totalDeliveries = (subscription.totalDeliveries || 0) + 1;
          await subscription.save();

          // Generate next delivery
          await subscriptionService.generateNextDelivery(subscription);
        }
        break;
      }

      case 'subscription.payment_failed': {
        const rzpSubscriptionId = payload.subscription.entity.id;
        const subscription = await Subscription.findOne({ razorpaySubscriptionId: rzpSubscriptionId });

        if (subscription) {
          subscription.status = 'payment_failed';
          await subscription.save();

          // Mark latest upcoming delivery as payment_failed
          const delivery = await SubscriptionDelivery.findOne({
            subscription: subscription._id,
            status: 'upcoming',
          }).sort({ scheduledDate: 1 });

          if (delivery) {
            delivery.status = 'payment_failed';
            await delivery.save();
          }
        }
        break;
      }

      case 'subscription.paused': {
        const rzpSubscriptionId = payload.subscription.entity.id;
        const subscription = await Subscription.findOne({ razorpaySubscriptionId: rzpSubscriptionId });

        if (subscription) {
          subscription.status = 'paused';
          await subscription.save();
        }
        break;
      }

      case 'subscription.resumed': {
        const rzpSubscriptionId = payload.subscription.entity.id;
        const subscription = await Subscription.findOne({ razorpaySubscriptionId: rzpSubscriptionId });

        if (subscription) {
          subscription.status = 'active';
          await subscription.save();
        }
        break;
      }

      case 'subscription.cancelled': {
        const rzpSubscriptionId = payload.subscription.entity.id;
        const subscription = await Subscription.findOne({ razorpaySubscriptionId: rzpSubscriptionId });

        if (subscription) {
          subscription.status = 'cancelled';
          subscription.cancelledAt = new Date();
          await subscription.save();
        }
        break;
      }

      default:
        // Unknown event type — acknowledge anyway
        break;
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    next(error);
  }
};
