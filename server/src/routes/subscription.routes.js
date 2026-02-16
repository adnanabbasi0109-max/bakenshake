const express = require('express');
const router = express.Router();
const controller = require('../controllers/subscription.controller');
const { protect, optionalAuth } = require('../middleware/auth');

router.post('/create', protect, controller.createSubscription);
router.get('/my', protect, controller.getMySubscriptions);
router.get('/eligible-products', optionalAuth, controller.getEligibleProducts);
router.post('/suggest-basket', protect, controller.suggestBasket);
router.get('/:id', protect, controller.getSubscription);
router.put('/:id/pause', protect, controller.pauseSubscription);
router.put('/:id/resume', protect, controller.resumeSubscription);
router.put('/:id/cancel', protect, controller.cancelSubscription);
router.put('/:id/frequency', protect, controller.changeFrequency);
router.put('/:id/address', protect, controller.updateAddress);
router.put('/:id/slot', protect, controller.updateSlot);

module.exports = router;
