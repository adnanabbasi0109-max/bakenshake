const mongoose = require('mongoose');

const slotCapacitySchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      enum: ['Bhopal', 'Indore', 'Gwalior'],
    },
    date: { type: Date, required: true },
    timeSlot: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    maxCapacity: { type: Number, required: true, default: 50 },
    bookedCount: { type: Number, default: 0 },
    subscriptionReserved: { type: Number, default: 0 },
  },
  { timestamps: true }
);

slotCapacitySchema.index(
  { city: 1, date: 1, 'timeSlot.start': 1 },
  { unique: true }
);

module.exports = mongoose.model('SlotCapacity', slotCapacitySchema);
