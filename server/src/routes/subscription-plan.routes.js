const express = require('express');
const router = express.Router();
const controller = require('../controllers/subscription-plan.controller');
const { protect, optionalAuth, adminOnly } = require('../middleware/auth');

// Public
router.get('/', optionalAuth, controller.getPlans);
router.get('/featured', controller.getFeaturedPlans);
router.get('/:slug', optionalAuth, controller.getPlanBySlug);
router.get('/:slug/swap-options', optionalAuth, controller.getSwapOptions);

// Admin
router.post('/', protect, adminOnly, controller.createPlan);
router.put('/:id', protect, adminOnly, controller.updatePlan);
router.delete('/:id', protect, adminOnly, controller.deletePlan);

module.exports = router;
