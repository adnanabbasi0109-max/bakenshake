"use client";
import ProductCard from "@/components/product/ProductCard";

// Static featured products for initial render (will be replaced by API data)
const featuredProducts = [
  {
    _id: "1",
    name: "Classic Chocolate Truffle Cake",
    slug: "classic-chocolate-truffle-cake",
    shortDescription: "Rich chocolate truffle cake with Belgian cocoa",
    images: [{ url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80", alt: "Chocolate truffle cake", isPrimary: true }],
    variants: [{ _id: "v1", size: "0.5 kg", price: 449, compareAtPrice: 549 }],
    dietaryTags: ["eggless", "veg"],
    ratings: { average: 4.7, count: 234 },
  },
  {
    _id: "2",
    name: "Red Velvet Dream Cake",
    slug: "red-velvet-dream-cake",
    shortDescription: "Classic red velvet with cream cheese frosting",
    images: [{ url: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&q=80", alt: "Red velvet cake", isPrimary: true }],
    variants: [{ _id: "v2", size: "0.5 kg", price: 499, compareAtPrice: 599 }],
    dietaryTags: ["eggless", "veg"],
    ratings: { average: 4.8, count: 189 },
  },
  {
    _id: "3",
    name: "Chocolate Chip Cookies Pack",
    slug: "chocolate-chip-cookies-pack",
    shortDescription: "Classic chocolate chip cookies, pack of 12",
    images: [{ url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80", alt: "Chocolate chip cookies", isPrimary: true }],
    variants: [{ _id: "v3", size: "200g", price: 149, compareAtPrice: 179 }],
    dietaryTags: ["eggless", "veg"],
    ratings: { average: 4.6, count: 445 },
  },
  {
    _id: "4",
    name: "Classic Fudge Brownie",
    slug: "classic-fudge-brownie",
    shortDescription: "Dense dark chocolate fudge brownie",
    images: [{ url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80", alt: "Chocolate fudge brownie", isPrimary: true }],
    variants: [{ _id: "v4", size: "Single", price: 89 }],
    dietaryTags: ["eggless", "veg"],
    ratings: { average: 4.8, count: 523 },
  },
  {
    _id: "5",
    name: "Butter Croissant",
    slug: "butter-croissant",
    shortDescription: "Freshly baked French butter croissant",
    images: [{ url: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&q=80", alt: "Butter croissant", isPrimary: true }],
    variants: [{ _id: "v5", size: "Single", price: 79 }],
    dietaryTags: ["eggless", "veg"],
    ratings: { average: 4.5, count: 334 },
  },
  {
    _id: "6",
    name: "Cold Coffee",
    slug: "cold-coffee",
    shortDescription: "Creamy cold coffee with Arabica beans",
    images: [{ url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80", alt: "Cold coffee", isPrimary: true }],
    variants: [{ _id: "v6", size: "Regular (300ml)", price: 129 }],
    dietaryTags: ["veg"],
    ratings: { average: 4.5, count: 312 },
  },
  {
    _id: "7",
    name: "Margherita Pizza",
    slug: "margherita-pizza",
    shortDescription: "Classic thin-crust Margherita pizza",
    images: [{ url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80", alt: "Margherita pizza", isPrimary: true }],
    variants: [{ _id: "v7", size: "Regular (8\")", price: 199 }],
    dietaryTags: ["veg"],
    ratings: { average: 4.4, count: 456 },
  },
  {
    _id: "8",
    name: "Diwali Premium Gift Hamper",
    slug: "diwali-premium-gift-hamper",
    shortDescription: "Premium Diwali gift box with assorted treats",
    images: [{ url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80", alt: "Diwali gift hamper", isPrimary: true }],
    variants: [{ _id: "v8", size: "Standard", price: 999, compareAtPrice: 1299 }],
    dietaryTags: ["eggless", "veg"],
    ratings: { average: 4.8, count: 89 },
  },
];

export default function FeaturedProducts() {
  return (
    <section className="py-10 md:py-14 bg-brand-sage-light/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary">
              Best Sellers
            </h2>
            <p className="text-text-muted text-sm mt-1">Our most loved treats</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
