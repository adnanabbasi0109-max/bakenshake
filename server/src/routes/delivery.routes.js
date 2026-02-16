const express = require('express');
const { body, query } = require('express-validator');
const router = express.Router();
const deliveryController = require('../controllers/delivery.controller');
const validate = require('../middleware/validate');

router.post(
  '/check-pincode',
  validate([
    body('pincode')
      .isLength({ min: 6, max: 6 })
      .isNumeric()
      .withMessage('Valid 6-digit pincode required'),
  ]),
  deliveryController.checkPincode
);

router.get('/slots', deliveryController.getDeliverySlots);

module.exports = router;
