const express = require('express');
const router = express.Router();
const controller = require('../controllers/subscription-delivery.controller');
const { protect } = require('../middleware/auth');

router.get('/upcoming', protect, controller.getUpcomingDeliveries);
router.get('/:id', protect, controller.getDelivery);
router.put('/:id/skip', protect, controller.skipDelivery);
router.put('/:id/unskip', protect, controller.unskipDelivery);
router.put('/:id/swap', protect, controller.swapItem);
router.post('/:id/pay', protect, controller.payManual);

module.exports = router;
