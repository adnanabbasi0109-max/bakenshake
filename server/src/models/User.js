const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Home' },
  line1: { type: String, required: true },
  line2: String,
  city: { type: String, required: true },
  state: { type: String, default: 'Madhya Pradesh' },
  pincode: { type: String, required: true },
  lat: Number,
  lng: Number,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    phone: { type: String, unique: true, sparse: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    passwordHash: String,
    authProvider: {
      type: String,
      enum: ['phone', 'email', 'google'],
      default: 'phone',
    },
    googleId: String,
    avatar: String,
    addresses: [addressSchema],
    role: {
      type: String,
      enum: ['customer', 'admin', 'delivery'],
      default: 'customer',
    },
    loyaltyPoints: { type: Number, default: 0 },
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    otp: String,
    otpExpiry: Date,
    refreshToken: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('passwordHash') && this.passwordHash) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.otp;
  delete obj.otpExpiry;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
