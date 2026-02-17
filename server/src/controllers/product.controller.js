const Product = require('../models/Product');

// GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      category,
      city,
      dietary,
      minPrice,
      maxPrice,
      sort,
      search,
      featured,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (dietary) filter.dietaryTags = { $in: dietary.split(',') };
    if (featured === 'true') filter.isFeatured = true;

    // City-based filtering
    if (city && city !== 'pan-india') {
      // Show products available in the selected city + pan-India shippable products
      filter.$or = [
        { availableInCities: city },
        { isShippable: true },
      ];
    } else if (city === 'pan-india') {
      filter.isShippable = true;
    }

    // Price range filtering (checks any variant price)
    if (minPrice || maxPrice) {
      filter['variants.price'] = {};
      if (minPrice) filter['variants.price'].$gte = Number(minPrice);
      if (maxPrice) filter['variants.price'].$lte = Number(maxPrice);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Sort options
    let sortOption = { sortOrder: 1, createdAt: -1 };
    if (sort === 'price-low') sortOption = { 'variants.0.price': 1 };
    else if (sort === 'price-high') sortOption = { 'variants.0.price': -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'rating') sortOption = { 'ratings.average': -1 };
    else if (sort === 'popular') sortOption = { 'ratings.count': -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      data: products,
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

// GET /api/products/featured
exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const { city, limit = 8 } = req.query;
    const filter = { isActive: true, isFeatured: true };

    if (city && city !== 'pan-india') {
      filter.$or = [{ availableInCities: city }, { isShippable: true }];
    } else if (city === 'pan-india') {
      filter.isShippable = true;
    }

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ sortOrder: 1 })
      .limit(Number(limit));

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/search
exports.searchProducts = async (req, res, next) => {
  try {
    const { q, city, limit = 10 } = req.query;
    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const filter = {
      isActive: true,
      $text: { $search: q },
    };

    if (city && city !== 'pan-india') {
      filter.$or = [{ availableInCities: city }, { isShippable: true }];
    }

    const products = await Product.find(filter, { score: { $meta: 'textScore' } })
      .populate('category', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .limit(Number(limit));

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:slug
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    }).populate('category', 'name slug');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Get related products from same category
    const related = await Product.find({
      category: product.category._id,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .select('name slug images variants dietaryTags ratings');

    res.json({ success: true, data: { product, related } });
  } catch (error) {
    next(error);
  }
};
