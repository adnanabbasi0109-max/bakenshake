const Category = require('../models/Category');
const Product = require('../models/Product');

// GET /api/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1 })
      .populate('parentCategory', 'name slug');

    // Group into parent + children
    const parentCategories = categories.filter((c) => !c.parentCategory);
    const result = parentCategories.map((parent) => ({
      ...parent.toObject(),
      children: categories
        .filter((c) => c.parentCategory && c.parentCategory._id.toString() === parent._id.toString())
        .map((c) => c.toObject()),
    }));

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:slug
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Get subcategories
    const subcategories = await Category.find({
      parentCategory: category._id,
      isActive: true,
    }).sort({ sortOrder: 1 });

    res.json({ success: true, data: { category, subcategories } });
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:slug/products
exports.getCategoryProducts = async (req, res, next) => {
  try {
    const { city, dietary, sort, page = 1, limit = 12, minPrice, maxPrice } = req.query;

    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Include subcategory products
    const subcategories = await Category.find({ parentCategory: category._id });
    const categoryIds = [category._id, ...subcategories.map((s) => s._id)];

    const filter = { category: { $in: categoryIds }, isActive: true };

    if (city && city !== 'pan-india') {
      filter.$or = [{ availableInCities: city }, { isShippable: true }];
    } else if (city === 'pan-india') {
      filter.isShippable = true;
    }

    if (dietary) filter.dietaryTags = { $in: dietary.split(',') };

    if (minPrice || maxPrice) {
      filter['variants.price'] = {};
      if (minPrice) filter['variants.price'].$gte = Number(minPrice);
      if (maxPrice) filter['variants.price'].$lte = Number(maxPrice);
    }

    let sortOption = { sortOrder: 1, createdAt: -1 };
    if (sort === 'price-low') sortOption = { 'variants.0.price': 1 };
    else if (sort === 'price-high') sortOption = { 'variants.0.price': -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'rating') sortOption = { 'ratings.average': -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: {
        category,
        subcategories: await Category.find({ parentCategory: category._id, isActive: true }),
        products,
      },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};
