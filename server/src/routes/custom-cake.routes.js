const express = require('express');
const router = express.Router();
const customCakeController = require('../controllers/custom-cake.controller');
const { protect, optionalAuth } = require('../middleware/auth');

// Public — calculate price without auth
router.post('/calculate-price', customCakeController.calculatePrice);

// Public — generate preview (rate-limited by design, no auth needed for demo)
router.post('/generate-preview', customCakeController.generatePreview);

// Requires auth — create a custom cake order
router.post('/create', optionalAuth, customCakeController.createOrder);

// Requires auth — get all orders for the logged-in user
router.get('/my-orders', protect, customCakeController.getMyOrders);

// Requires auth — get order details
router.get('/:id', optionalAuth, customCakeController.getOrder);

module.exports = router;
