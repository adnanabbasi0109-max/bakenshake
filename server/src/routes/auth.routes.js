const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post(
  '/send-otp',
  validate([
    body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number required'),
  ]),
  authController.sendOtp
);

router.post(
  '/verify-otp',
  validate([
    body('phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
  ]),
  authController.verifyOtp
);

router.post(
  '/register',
  validate([
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ]),
  authController.register
);

router.post(
  '/login',
  validate([
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  authController.login
);

router.post('/google', authController.googleAuth);

router.post(
  '/refresh-token',
  validate([body('refreshToken').notEmpty().withMessage('Refresh token required')]),
  authController.refreshToken
);

router.get('/me', protect, authController.getMe);

router.put(
  '/profile',
  protect,
  validate([
    body('name').optional().trim().isLength({ min: 2 }),
    body('email').optional().isEmail().normalizeEmail(),
  ]),
  authController.updateProfile
);

module.exports = router;
