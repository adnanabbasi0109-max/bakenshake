const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    description: String,
    image: String,
    bannerImage: String,
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isLocalOnly: { type: Boolean, default: false },
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1 });

module.exports = mongoose.model('Category', categorySchema);
