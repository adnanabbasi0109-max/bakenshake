const mongoose = require('mongoose');

const deliveryZoneSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, unique: true },
    pincodes: [String],
    deliveryCharges: {
      freeAbove: { type: Number, default: 499 },
      baseCharge: { type: Number, default: 49 },
      perKmCharge: { type: Number, default: 5 },
    },
    deliverySlots: [
      {
        dayOfWeek: { type: Number, min: 0, max: 6 },
        timeRanges: [
          {
            start: String,
            end: String,
          },
        ],
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DeliveryZone', deliveryZoneSchema);
