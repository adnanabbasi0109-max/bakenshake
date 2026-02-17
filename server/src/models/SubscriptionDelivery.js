const mongoose = require('mongoose');

const deliveryItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantIndex: { type: Number, default: 0 },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  productName: String,
  productImage: String,
});

const subscriptionDeliverySchema = new mongoose.Schema(
  {
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    deliveryNumber: { type: Number, required: true },

    items: [deliveryItemSchema],

    // Scheduling
    scheduledDate: { type: Date, required: true },
    deliverySlot: {
      start: String,
      end: String,
    },

    // Pricing snapshot
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // Delivery address snapshot
    deliveryAddress: {
      label: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      pincode: String,
    },

    // Status
    status: {
      type: String,
      enum: [
        'upcoming',
        'locked',
        'payment_pending',
        'payment_failed',
        'paid',
        'preparing',
        'out_for_delivery',
        'delivered',
        'skipped',
        'cancelled',
      ],
      default: 'upcoming',
    },

    editCutoffAt: { type: Date, required: true },
    isSkipped: { type: Boolean, default: false },
    skipReason: String,

    // Payment
    razorpayPaymentId: String,
    razorpayInvoiceId: String,
    paidAt: Date,

    // Delivery tracking
    deliveredAt: Date,
    deliveryNotes: String,
  },
  { timestamps: true }
);

subscriptionDeliverySchema.index({ subscription: 1, scheduledDate: 1 });
subscriptionDeliverySchema.index({ user: 1, status: 1 });
subscriptionDeliverySchema.index({ scheduledDate: 1, status: 1 });
subscriptionDeliverySchema.index({
  'deliveryAddress.city': 1,
  scheduledDate: 1,
  status: 1,
});

module.exports = mongoose.model('SubscriptionDelivery', subscriptionDeliverySchema);
