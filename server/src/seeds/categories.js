const categories = [
  // Parent Categories
  {
    name: 'Cakes',
    slug: 'cakes',
    description: 'Fresh celebration cakes, designer cakes, and custom cakes baked with love',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=1200&q=80',
    sortOrder: 1,
    isLocalOnly: true,
  },
  {
    name: 'Bakery',
    slug: 'bakery',
    description: 'Freshly baked cookies, cream rolls, tea cakes, breads, and more',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&q=80',
    sortOrder: 2,
    isLocalOnly: false,
  },
  {
    name: 'Bouquets',
    slug: 'bouquets',
    description: 'Curated gift arrangements for every occasion',
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1200&q=80',
    sortOrder: 3,
    isLocalOnly: true,
  },
  {
    name: 'Festive Hampers',
    slug: 'festive-hampers',
    description: 'Premium gift hampers for festivals and celebrations',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=1200&q=80',
    sortOrder: 4,
    isLocalOnly: false,
  },
  {
    name: 'Combos',
    slug: 'combos',
    description: 'Value bundles and combo offers',
    image: 'https://images.unsplash.com/photo-1486427944544-d2c246c4df6e?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1486427944544-d2c246c4df6e?w=1200&q=80',
    sortOrder: 5,
    isLocalOnly: false,
  },
  {
    name: 'Beverages',
    slug: 'beverages',
    description: 'Shakes, coffees, fresh juices, and more from our cafe menu',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=1200&q=80',
    sortOrder: 6,
    isLocalOnly: true,
  },
  {
    name: 'Food Menu',
    slug: 'food-menu',
    description: 'Sandwiches, burgers, pizza, pasta, and more',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80',
    sortOrder: 7,
    isLocalOnly: true,
  },
];

// Subcategories (will be linked to parents after creation)
const subcategories = [
  // Cakes subcategories
  { name: 'All Time Celebration Cakes', slug: 'celebration-cakes', parent: 'cakes', sortOrder: 1 },
  { name: 'Creative & Designer Cakes', slug: 'designer-cakes', parent: 'cakes', sortOrder: 2 },
  { name: 'Theme Cakes for Kids', slug: 'kids-theme-cakes', parent: 'cakes', sortOrder: 3 },
  { name: 'Photo Print Cakes', slug: 'photo-print-cakes', parent: 'cakes', sortOrder: 4 },
  { name: 'Wedding & Anniversary Cakes', slug: 'wedding-anniversary-cakes', parent: 'cakes', sortOrder: 5 },
  { name: 'Seasonal Theme Cakes', slug: 'seasonal-theme-cakes', parent: 'cakes', sortOrder: 6 },

  // Bakery subcategories
  { name: 'Cookies Packs', slug: 'cookies-packs', parent: 'bakery', sortOrder: 1 },
  { name: 'Cream Rolls', slug: 'cream-rolls', parent: 'bakery', sortOrder: 2 },
  { name: 'Tea Cakes', slug: 'tea-cakes', parent: 'bakery', sortOrder: 3 },
  { name: 'Breads & Buns', slug: 'breads-buns', parent: 'bakery', sortOrder: 4 },
  { name: 'Pastries & Patties', slug: 'pastries-patties', parent: 'bakery', sortOrder: 5 },
  { name: 'Rusks & Toasts', slug: 'rusks-toasts', parent: 'bakery', sortOrder: 6 },
  { name: 'Dry Cakes & Brownies', slug: 'dry-cakes-brownies', parent: 'bakery', sortOrder: 7 },

  // Food Menu subcategories
  { name: 'Sandwiches', slug: 'sandwiches', parent: 'food-menu', sortOrder: 1 },
  { name: 'Burgers', slug: 'burgers', parent: 'food-menu', sortOrder: 2 },
  { name: 'Pizza', slug: 'pizza', parent: 'food-menu', sortOrder: 3 },
  { name: 'Pasta', slug: 'pasta', parent: 'food-menu', sortOrder: 4 },
  { name: 'Chinese', slug: 'chinese', parent: 'food-menu', sortOrder: 5 },

  // Beverages subcategories
  { name: 'Shakes', slug: 'shakes', parent: 'beverages', sortOrder: 1 },
  { name: 'Coffee', slug: 'coffee', parent: 'beverages', sortOrder: 2 },
  { name: 'Fresh Juices', slug: 'fresh-juices', parent: 'beverages', sortOrder: 3 },
];

module.exports = { categories, subcategories };
