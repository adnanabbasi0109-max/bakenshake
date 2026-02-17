const DeliveryZone = require('../models/DeliveryZone');

// POST /api/delivery/check-pincode
exports.checkPincode = async (req, res, next) => {
  try {
    const { pincode } = req.body;

    const zone = await DeliveryZone.findOne({
      pincodes: pincode,
      isActive: true,
    });

    if (zone) {
      return res.json({
        success: true,
        deliverable: true,
        city: zone.city,
        deliveryCharges: zone.deliveryCharges,
        message: `Delivery available in ${zone.city}`,
      });
    }

    // Not in local delivery zone — check if pan-India shipping is possible
    res.json({
      success: true,
      deliverable: false,
      panIndiaOnly: true,
      message: 'Local delivery not available. Only shelf-stable products can be shipped to this pincode.',
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/delivery/slots
exports.getDeliverySlots = async (req, res, next) => {
  try {
    const { city, date } = req.query;

    const zone = await DeliveryZone.findOne({ city, isActive: true });
    if (!zone) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }

    // Generate available slots for the next 7 days
    const slots = [];
    const startDate = date ? new Date(date) : new Date();

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dayOfWeek = d.getDay();

      const daySlots = zone.deliverySlots.find((s) => s.dayOfWeek === dayOfWeek);
      if (daySlots) {
        slots.push({
          date: d.toISOString().split('T')[0],
          dayName: d.toLocaleDateString('en-IN', { weekday: 'long' }),
          timeRanges: daySlots.timeRanges,
        });
      }
    }

    res.json({
      success: true,
      data: {
        city: zone.city,
        deliveryCharges: zone.deliveryCharges,
        slots,
      },
    });
  } catch (error) {
    next(error);
  }
};
