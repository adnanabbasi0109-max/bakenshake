const mongoose = require('mongoose');

const customCakeOrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    specifications: {
      shape: {
        type: String,
        enum: ['round', 'square', 'heart', 'rectangle', 'tiered-2', 'tiered-3'],
        required: true,
      },
      size: {
        type: String,
        enum: ['0.5 kg', '1 kg', '1.5 kg', '2 kg', '3 kg', '5 kg'],
        required: true,
      },
      flavor: {
        type: String,
        enum: [
          'vanilla', 'chocolate', 'red-velvet', 'butterscotch', 'black-forest',
          'pineapple', 'mango', 'strawberry', 'coffee-mocha', 'fruit',
        ],
        required: true,
      },
      frostingType: {
        type: String,
        enum: ['buttercream', 'fondant', 'whipped-cream', 'ganache', 'cream-cheese'],
        required: true,
      },
      frostingColor: { type: String, required: true },
      filling: {
        type: String,
        enum: ['none', 'chocolate-ganache', 'fruit-compote', 'caramel', 'nutella', 'cream', 'jam'],
        default: 'none',
      },
      toppings: [
        {
          type: String,
          enum: [
            'fresh-fruits', 'chocolate-shavings', 'sprinkles', 'edible-flowers',
            'nuts', 'macarons', 'fondant-figures', 'gold-silver-leaf',
          ],
        },
      ],
      theme: {
        type: String,
        enum: [
          'birthday', 'wedding', 'anniversary', 'baby-shower', 'graduation',
          'valentine', 'christmas', 'diwali', 'generic-celebration',
        ],
        required: true,
      },
      message: { type: String, maxlength: 50 },
      eggPreference: {
        type: String,
        enum: ['egg', 'eggless'],
        default: 'eggless',
      },
      photoUploadUrl: String,
    },
    aiPreviewImageUrl: String,
    aiGenerationCount: { type: Number, default: 0 },
    calculatedPrice: { type: Number, required: true },
    adminAdjustedPrice: Number,
    status: {
      type: String,
      enum: ['pending_review', 'quoted', 'accepted', 'in_production', 'ready', 'delivered', 'cancelled'],
      default: 'pending_review',
    },
    adminNotes: String,
    customerNotes: String,
  },
  { timestamps: true }
);

customCakeOrderSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('CustomCakeOrder', customCakeOrderSchema);
