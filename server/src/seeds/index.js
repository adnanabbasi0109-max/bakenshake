require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');
const Category = require('../models/Category');
const Product = require('../models/Product');
const DeliveryZone = require('../models/DeliveryZone');
const { categories, subcategories } = require('./categories');
const products = require('./products');
const deliveryZones = require('./deliveryZones');

const seed = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await DeliveryZone.deleteMany({});

    // Seed categories
    console.log('Seeding categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`  Created ${createdCategories.length} parent categories`);

    // Create a slug-to-id map for parent categories
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // Seed subcategories with parent references
    const subCategoryDocs = subcategories.map((sub) => ({
      name: sub.name,
      slug: sub.slug,
      parentCategory: categoryMap[sub.parent],
      sortOrder: sub.sortOrder,
      isActive: true,
    }));

    const createdSubcategories = await Category.insertMany(subCategoryDocs);
    console.log(`  Created ${createdSubcategories.length} subcategories`);

    // Update category map with subcategories
    createdSubcategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // Seed products with correct category references
    console.log('Seeding products...');
    const productDocs = products.map((product) => {
      const { categorySlug, ...rest } = product;
      return {
        ...rest,
        category: categoryMap[categorySlug],
      };
    });

    const createdProducts = await Product.insertMany(productDocs);
    console.log(`  Created ${createdProducts.length} products`);

    // Seed delivery zones
    console.log('Seeding delivery zones...');
    const createdZones = await DeliveryZone.insertMany(deliveryZones);
    console.log(`  Created ${createdZones.length} delivery zones`);

    console.log('\nSeeding complete!');
    console.log('Summary:');
    console.log(`  Categories: ${createdCategories.length + createdSubcategories.length}`);
    console.log(`  Products: ${createdProducts.length}`);
    console.log(`  Delivery Zones: ${createdZones.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
