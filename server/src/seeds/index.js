require('dotenv').config();
const mongoose = require('mongoose');
const env = require('../config/env');
const Category = require('../models/Category');
const Product = require('../models/Product');
const DeliveryZone = require('../models/DeliveryZone');
const SubscriptionPlan = require('../models/SubscriptionPlan');
const { categories, subcategories } = require('./categories');
const products = require('./products');
const deliveryZones = require('./deliveryZones');
const subscriptionPlans = require('./subscriptionPlans');

// Map of product slugs to subscription fields
const subscriptionProductFields = {
  'chocolate-chip-cookies-pack': { subscriptionEligible: true, nutritionTags: ['high_fiber', 'whole_grain'], shelfLifeType: 'shelf_stable', subscriptionDiscountPercent: 10 },
  'classic-fudge-brownie': { subscriptionEligible: true, nutritionTags: ['low_sugar'], shelfLifeType: 'fresh', subscriptionDiscountPercent: 10 },
  'butter-croissant': { subscriptionEligible: true, nutritionTags: ['whole_grain'], shelfLifeType: 'fresh', subscriptionDiscountPercent: 10 },
  'honey-almond-tea-cake': { subscriptionEligible: true, nutritionTags: ['high_protein', 'low_sugar'], shelfLifeType: 'fresh', subscriptionDiscountPercent: 10 },
  'multigrain-bread-loaf': { subscriptionEligible: true, nutritionTags: ['high_fiber', 'whole_grain'], shelfLifeType: 'fresh', subscriptionDiscountPercent: 10 },
  'elaichi-rusk': { subscriptionEligible: true, nutritionTags: ['high_fiber'], shelfLifeType: 'shelf_stable', subscriptionDiscountPercent: 10 },
};

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
    await SubscriptionPlan.deleteMany({});

    // Seed categories
    console.log('Seeding categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`  Created ${createdCategories.length} parent categories`);

    // Create a slug-to-id map for parent categories
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // Seed subcategories with parent references (include image when present)
    const subCategoryDocs = subcategories.map((sub) => ({
      name: sub.name,
      slug: sub.slug,
      parentCategory: categoryMap[sub.parent],
      sortOrder: sub.sortOrder,
      isActive: true,
      ...(sub.image && { image: sub.image }),
      ...(sub.bannerImage && { bannerImage: sub.bannerImage }),
    }));

    const createdSubcategories = await Category.insertMany(subCategoryDocs);
    console.log(`  Created ${createdSubcategories.length} subcategories`);

    // Update category map with subcategories
    createdSubcategories.forEach((cat) => {
      categoryMap[cat.slug] = cat._id;
    });

    // Seed products with correct category references + subscription fields
    console.log('Seeding products...');
    const productDocs = products.map((product) => {
      const { categorySlug, ...rest } = product;
      const subFields = subscriptionProductFields[product.slug] || {};
      return {
        ...rest,
        ...subFields,
        category: categoryMap[categorySlug],
      };
    });

    const createdProducts = await Product.insertMany(productDocs);
    console.log(`  Created ${createdProducts.length} products`);

    // Build product slug-to-id map for subscription plans
    const productMap = {};
    createdProducts.forEach((prod) => {
      productMap[prod.slug] = prod._id;
    });

    // Seed subscription plans with product references
    console.log('Seeding subscription plans...');
    const planDocs = subscriptionPlans.map((plan) => {
      const { itemSlugs, ...rest } = plan;
      const items = itemSlugs
        .map((item) => ({
          product: productMap[item.slug],
          variantIndex: item.variantIndex,
          quantity: item.quantity,
          isSwappable: item.isSwappable,
        }))
        .filter((item) => item.product); // skip if product slug not found
      return { ...rest, items };
    });

    const createdPlans = await SubscriptionPlan.insertMany(planDocs);
    console.log(`  Created ${createdPlans.length} subscription plans`);

    // Seed delivery zones
    console.log('Seeding delivery zones...');
    const createdZones = await DeliveryZone.insertMany(deliveryZones);
    console.log(`  Created ${createdZones.length} delivery zones`);

    console.log('\nSeeding complete!');
    console.log('Summary:');
    console.log(`  Categories: ${createdCategories.length + createdSubcategories.length}`);
    console.log(`  Products: ${createdProducts.length}`);
    console.log(`  Subscription Plans: ${createdPlans.length}`);
    console.log(`  Delivery Zones: ${createdZones.length}`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
