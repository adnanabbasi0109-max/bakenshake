const User = require('../models/User');
const { generateOTP, sendOTP } = require('../services/sms.service');
const { generateTokenPair, verifyRefreshToken } = require('../services/token.service');
const crypto = require('crypto');

// Generate a unique referral code
const generateReferralCode = () => {
  return 'BNS' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

// POST /api/auth/send-otp
exports.sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    let user = await User.findOne({ phone });
    if (user) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      user = await User.create({
        phone,
        otp,
        otpExpiry,
        authProvider: 'phone',
        referralCode: generateReferralCode(),
      });
    }

    await sendOTP(phone, otp);

    res.json({
      success: true,
      message: 'OTP sent successfully',
      isNewUser: !user.name,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;

    const tokens = generateTokenPair(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      success: true,
      user,
      ...tokens,
      isNewUser: !user.name,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({
      $or: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : []),
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or phone already exists',
      });
    }

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: password,
      authProvider: 'email',
      referralCode: generateReferralCode(),
    });

    const tokens = generateTokenPair(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      user,
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const tokens = generateTokenPair(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      success: true,
      user,
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/google
exports.googleAuth = async (req, res, next) => {
  try {
    const { googleId, email, name, avatar } = req.body;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
      }
      if (avatar) user.avatar = avatar;
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        avatar,
        authProvider: 'google',
        referralCode: generateReferralCode(),
      });
    }

    const tokens = generateTokenPair(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({
      success: true,
      user,
      ...tokens,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/refresh-token
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const tokens = generateTokenPair(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save();

    res.json({ success: true, ...tokens });
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
