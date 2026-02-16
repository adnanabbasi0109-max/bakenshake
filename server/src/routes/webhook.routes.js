const express = require('express');
const router = express.Router();
const controller = require('../controllers/subscription-webhook.controller');

// Razorpay webhooks — no auth, signature-verified in controller
router.post('/razorpay-subscription', controller.handleWebhook);

module.exports = router;
