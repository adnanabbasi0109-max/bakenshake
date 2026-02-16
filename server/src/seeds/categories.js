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
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=1200&q=80',
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
// image/bannerImage optional; used when displaying category lists from API
const subcategories = [
  // Cakes subcategories
  { name: 'All Time Celebration Cakes', slug: 'celebration-cakes', parent: 'cakes', sortOrder: 1, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80' },
  { name: 'Creative & Designer Cakes', slug: 'designer-cakes', parent: 'cakes', sortOrder: 2, image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&q=80' },
  { name: 'Theme Cakes for Kids', slug: 'kids-theme-cakes', parent: 'cakes', sortOrder: 3, image: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80' },
  { name: 'Photo Print Cakes', slug: 'photo-print-cakes', parent: 'cakes', sortOrder: 4, image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80' },
  { name: 'Wedding & Anniversary Cakes', slug: 'wedding-anniversary-cakes', parent: 'cakes', sortOrder: 5, image: 'https://images.unsplash.com/photo-1557979619-445218f326b9?w=800&q=80' },
  { name: 'Seasonal Theme Cakes', slug: 'seasonal-theme-cakes', parent: 'cakes', sortOrder: 6, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80' },

  // Bakery subcategories
  { name: 'Cookies Packs', slug: 'cookies-packs', parent: 'bakery', sortOrder: 1, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80' },
  { name: 'Cream Rolls', slug: 'cream-rolls', parent: 'bakery', sortOrder: 2, image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&q=80' },
  { name: 'Tea Cakes', slug: 'tea-cakes', parent: 'bakery', sortOrder: 3, image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80' },
  { name: 'Breads & Buns', slug: 'breads-buns', parent: 'bakery', sortOrder: 4, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80' },
  { name: 'Pastries & Patties', slug: 'pastries-patties', parent: 'bakery', sortOrder: 5, image: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&q=80' },
  { name: 'Rusks & Toasts', slug: 'rusks-toasts', parent: 'bakery', sortOrder: 6, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80' },
  { name: 'Dry Cakes & Brownies', slug: 'dry-cakes-brownies', parent: 'bakery', sortOrder: 7, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80' },

  // Food Menu subcategories
  { name: 'Sandwiches', slug: 'sandwiches', parent: 'food-menu', sortOrder: 1, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80' },
  { name: 'Burgers', slug: 'burgers', parent: 'food-menu', sortOrder: 2, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80' },
  { name: 'Pizza', slug: 'pizza', parent: 'food-menu', sortOrder: 3, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80' },
  { name: 'Pasta', slug: 'pasta', parent: 'food-menu', sortOrder: 4, image: 'https://images.unsplash.com/photo-1551183053-bf91a1f81140?w=800&q=80' },
  { name: 'Chinese', slug: 'chinese', parent: 'food-menu', sortOrder: 5, image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&q=80' },

  // Beverages subcategories
  { name: 'Shakes', slug: 'shakes', parent: 'beverages', sortOrder: 1, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80' },
  { name: 'Coffee', slug: 'coffee', parent: 'beverages', sortOrder: 2, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80' },
  { name: 'Fresh Juices', slug: 'fresh-juices', parent: 'beverages', sortOrder: 3, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80' },
];

module.exports = { categories, subcategories };
