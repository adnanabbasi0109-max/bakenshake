"use client";
import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Star, ShoppingBag, Minus, Plus, Truck, Shield, Clock } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Breadcrumb from "@/components/common/Breadcrumb";
import ProductCard from "@/components/product/ProductCard";
import { useCartStore } from "@/store/cartStore";
import SubscribeAndSave from "@/components/subscription/SubscribeAndSave";

// Static demo product data — will be replaced by API
const demoProducts: Record<string, {
  _id: string; name: string; slug: string; description: string; shortDescription: string;
  category: { name: string; slug: string };
  images: { url: string; alt: string; isPrimary: boolean }[];
  variants: { _id: string; size: string; weight: string; price: number; compareAtPrice?: number }[];
  dietaryTags: string[]; shelfLife: string; ingredients: string;
  ratings: { average: number; count: number };
}> = {
  "classic-chocolate-truffle-cake": {
    _id: "1", name: "Classic Chocolate Truffle Cake", slug: "classic-chocolate-truffle-cake",
    description: "Rich, indulgent chocolate truffle cake layered with smooth ganache. Perfect for birthdays and celebrations. Made with premium Belgian cocoa. Each bite delivers an intense chocolate experience that will leave you wanting more.",
    shortDescription: "Rich chocolate truffle cake with Belgian cocoa",
    category: { name: "Cakes", slug: "cakes" },
    images: [
      { url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80", alt: "Chocolate truffle cake", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80", alt: "Chocolate cake slice", isPrimary: false },
    ],
    variants: [
      { _id: "v1a", size: "0.5 kg", weight: "500g", price: 449, compareAtPrice: 549 },
      { _id: "v1b", size: "1 kg", weight: "1kg", price: 799, compareAtPrice: 999 },
      { _id: "v1c", size: "2 kg", weight: "2kg", price: 1499, compareAtPrice: 1799 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "2 days (refrigerated)",
    ingredients: "Flour, cocoa powder, sugar, butter, cream, Belgian chocolate, vanilla extract",
    ratings: { average: 4.7, count: 234 },
  },
  "red-velvet-dream-cake": {
    _id: "2", name: "Red Velvet Dream Cake", slug: "red-velvet-dream-cake",
    description: "A luxurious red velvet cake with layers of smooth cream cheese frosting. The perfect balance of cocoa and vanilla with a striking red colour. Ideal for anniversaries, Valentine's Day, or any special occasion that calls for something truly elegant.",
    shortDescription: "Classic red velvet with cream cheese frosting",
    category: { name: "Cakes", slug: "cakes" },
    images: [
      { url: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&q=80", alt: "Red velvet cake", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800&q=80", alt: "Red velvet cake slice", isPrimary: false },
    ],
    variants: [
      { _id: "v2a", size: "0.5 kg", weight: "500g", price: 499, compareAtPrice: 599 },
      { _id: "v2b", size: "1 kg", weight: "1kg", price: 899, compareAtPrice: 1099 },
      { _id: "v2c", size: "2 kg", weight: "2kg", price: 1699, compareAtPrice: 1999 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "2 days (refrigerated)",
    ingredients: "Flour, sugar, cocoa powder, buttermilk, cream cheese, butter, vanilla extract, red food colour",
    ratings: { average: 4.8, count: 189 },
  },
  "butterscotch-crunch-cake": {
    _id: "3", name: "Butterscotch Crunch Cake", slug: "butterscotch-crunch-cake",
    description: "A delightful butterscotch cake topped with caramelised praline crunch. Made with real butterscotch sauce and layered with butterscotch cream. The crunchy praline topping adds a satisfying texture contrast to the soft, moist cake.",
    shortDescription: "Butterscotch cake with praline crunch topping",
    category: { name: "Cakes", slug: "cakes" },
    images: [
      { url: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800&q=80", alt: "Butterscotch cake", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80", alt: "Butterscotch cake close-up", isPrimary: false },
    ],
    variants: [
      { _id: "v3a", size: "0.5 kg", weight: "500g", price: 399, compareAtPrice: 499 },
      { _id: "v3b", size: "1 kg", weight: "1kg", price: 699, compareAtPrice: 899 },
      { _id: "v3c", size: "2 kg", weight: "2kg", price: 1299, compareAtPrice: 1599 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "2 days (refrigerated)",
    ingredients: "Flour, sugar, butter, butterscotch sauce, cream, praline, caramel, vanilla extract",
    ratings: { average: 4.5, count: 156 },
  },
  "black-forest-cake": {
    _id: "4", name: "Black Forest Cake", slug: "black-forest-cake",
    description: "The timeless classic Black Forest cake with layers of chocolate sponge, whipped cream, and juicy cherries. Finished with chocolate shavings and cherry topping. A crowd favourite that never goes out of style.",
    shortDescription: "Classic Black Forest with cherries & cream",
    category: { name: "Cakes", slug: "cakes" },
    images: [
      { url: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80", alt: "Black Forest cake", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80", alt: "Black Forest cake detail", isPrimary: false },
    ],
    variants: [
      { _id: "v4a", size: "0.5 kg", weight: "500g", price: 449 },
      { _id: "v4b", size: "1 kg", weight: "1kg", price: 799 },
      { _id: "v4c", size: "2 kg", weight: "2kg", price: 1499 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "2 days (refrigerated)",
    ingredients: "Flour, cocoa powder, sugar, cream, cherries, chocolate shavings, vanilla extract",
    ratings: { average: 4.6, count: 312 },
  },
  "pineapple-fresh-cream-cake": {
    _id: "5", name: "Pineapple Fresh Cream Cake", slug: "pineapple-fresh-cream-cake",
    description: "A light and refreshing pineapple cake made with real pineapple chunks and fresh whipped cream. The tangy-sweet pineapple flavour paired with fluffy cream makes it a perfect choice for summer celebrations and family gatherings.",
    shortDescription: "Fresh pineapple cake with whipped cream",
    category: { name: "Cakes", slug: "cakes" },
    images: [
      { url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80", alt: "Pineapple cake", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1557979619-445218f326b9?w=800&q=80", alt: "Pineapple cake slice", isPrimary: false },
    ],
    variants: [
      { _id: "v5a", size: "0.5 kg", weight: "500g", price: 349 },
      { _id: "v5b", size: "1 kg", weight: "1kg", price: 649 },
      { _id: "v5c", size: "2 kg", weight: "2kg", price: 1199 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "2 days (refrigerated)",
    ingredients: "Flour, sugar, pineapple, fresh cream, butter, vanilla extract, pineapple essence",
    ratings: { average: 4.4, count: 198 },
  },
  "mango-delight-cake": {
    _id: "6", name: "Mango Delight Cake", slug: "mango-delight-cake",
    description: "A seasonal favourite made with fresh Alphonso mangoes. Layers of mango-infused sponge, mango cream, and real mango chunks create a tropical taste experience. Available during mango season for the freshest flavour.",
    shortDescription: "Fresh Alphonso mango layered cake",
    category: { name: "Cakes", slug: "cakes" },
    images: [
      { url: "https://images.unsplash.com/photo-1557979619-445218f326b9?w=800&q=80", alt: "Mango cake", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&q=80", alt: "Mango cake slice", isPrimary: false },
    ],
    variants: [
      { _id: "v6a", size: "0.5 kg", weight: "500g", price: 499 },
      { _id: "v6b", size: "1 kg", weight: "1kg", price: 899 },
      { _id: "v6c", size: "2 kg", weight: "2kg", price: 1699 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "2 days (refrigerated)",
    ingredients: "Flour, sugar, Alphonso mango pulp, fresh cream, butter, mango essence, vanilla extract",
    ratings: { average: 4.9, count: 89 },
  },
  "chocolate-chip-cookies-pack": {
    _id: "7", name: "Chocolate Chip Cookies Pack", slug: "chocolate-chip-cookies-pack",
    description: "Classic chocolate chip cookies baked to golden perfection. Each cookie is loaded with premium chocolate chips and has a crispy edge with a soft, chewy centre. Comes in a pack of 12 — perfect for sharing with family and friends.",
    shortDescription: "Classic chocolate chip cookies, pack of 12",
    category: { name: "Bakery", slug: "bakery" },
    images: [
      { url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80", alt: "Chocolate chip cookies", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", alt: "Cookies close-up", isPrimary: false },
    ],
    variants: [
      { _id: "v7a", size: "200g (12 pcs)", weight: "200g", price: 149, compareAtPrice: 179 },
      { _id: "v7b", size: "400g (24 pcs)", weight: "400g", price: 269, compareAtPrice: 329 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "7 days (airtight container)",
    ingredients: "Flour, butter, sugar, chocolate chips, brown sugar, vanilla extract, baking soda, salt",
    ratings: { average: 4.6, count: 445 },
  },
  "classic-fudge-brownie": {
    _id: "8", name: "Classic Fudge Brownie", slug: "classic-fudge-brownie",
    description: "Dense, rich dark chocolate fudge brownie that melts in your mouth. Made with premium dark chocolate and real butter for an intensely chocolatey experience. Perfect with a glass of cold milk or a scoop of vanilla ice cream.",
    shortDescription: "Dense dark chocolate fudge brownie",
    category: { name: "Bakery", slug: "bakery" },
    images: [
      { url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80", alt: "Fudge brownie", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80", alt: "Brownie close-up", isPrimary: false },
    ],
    variants: [
      { _id: "v8a", size: "Single", weight: "80g", price: 89 },
      { _id: "v8b", size: "Box of 4", weight: "320g", price: 319 },
      { _id: "v8c", size: "Box of 8", weight: "640g", price: 599 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "5 days (refrigerated)",
    ingredients: "Dark chocolate, butter, sugar, flour, cocoa powder, vanilla extract, salt",
    ratings: { average: 4.8, count: 523 },
  },
  "butter-croissant": {
    _id: "9", name: "Butter Croissant", slug: "butter-croissant",
    description: "Freshly baked French-style butter croissant with a golden, flaky exterior and soft, buttery layers inside. Made using traditional lamination technique with premium European-style butter for authentic flavour and texture.",
    shortDescription: "Freshly baked French butter croissant",
    category: { name: "Bakery", slug: "bakery" },
    images: [
      { url: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&q=80", alt: "Butter croissant", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80", alt: "Croissant close-up", isPrimary: false },
    ],
    variants: [
      { _id: "v9a", size: "Single", weight: "70g", price: 79 },
      { _id: "v9b", size: "Box of 4", weight: "280g", price: 289 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "1 day (best fresh)",
    ingredients: "Flour, European butter, sugar, yeast, milk, salt",
    ratings: { average: 4.5, count: 334 },
  },
  "honey-almond-tea-cake": {
    _id: "10", name: "Honey Almond Tea Cake", slug: "honey-almond-tea-cake",
    description: "A moist, fragrant tea cake made with natural honey and topped with toasted almonds. Perfect companion for your evening tea or coffee. The honey gives a natural sweetness while the almonds add a delightful crunch.",
    shortDescription: "Moist honey cake with toasted almonds",
    category: { name: "Bakery", slug: "bakery" },
    images: [
      { url: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80", alt: "Honey almond tea cake", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", alt: "Tea cake slice", isPrimary: false },
    ],
    variants: [
      { _id: "v10a", size: "250g", weight: "250g", price: 179 },
      { _id: "v10b", size: "500g", weight: "500g", price: 329 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "4 days (airtight container)",
    ingredients: "Flour, honey, almonds, butter, sugar, milk, vanilla extract, baking powder",
    ratings: { average: 4.7, count: 156 },
  },
  "multigrain-bread-loaf": {
    _id: "11", name: "Multigrain Bread Loaf", slug: "multigrain-bread-loaf",
    description: "Freshly baked multigrain bread loaded with seeds and whole grains. A healthier option for everyday sandwiches and toast. Made with a blend of wheat, oats, flaxseeds, sunflower seeds, and sesame seeds.",
    shortDescription: "Fresh multigrain bread with seeds",
    category: { name: "Bakery", slug: "bakery" },
    images: [
      { url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80", alt: "Multigrain bread", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=800&q=80", alt: "Bread slice", isPrimary: false },
    ],
    variants: [
      { _id: "v11a", size: "Regular", weight: "400g", price: 79 },
      { _id: "v11b", size: "Large", weight: "700g", price: 129 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "3 days (room temperature)",
    ingredients: "Whole wheat flour, oats, flaxseeds, sunflower seeds, sesame seeds, yeast, salt, honey",
    ratings: { average: 4.5, count: 89 },
  },
  "elaichi-rusk": {
    _id: "12", name: "Elaichi Rusk", slug: "elaichi-rusk",
    description: "Traditional cardamom-flavoured crispy rusk made with pure ghee. Twice-baked for the perfect crunch. Enjoy with your morning chai or as a light snack. A beloved Indian bakery classic that pairs perfectly with tea.",
    shortDescription: "Cardamom-flavoured crispy rusk with ghee",
    category: { name: "Bakery", slug: "bakery" },
    images: [
      { url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80", alt: "Elaichi rusk", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80", alt: "Rusk close-up", isPrimary: false },
    ],
    variants: [
      { _id: "v12a", size: "300g", weight: "300g", price: 99 },
      { _id: "v12b", size: "600g", weight: "600g", price: 179 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "30 days (airtight container)",
    ingredients: "Flour, ghee, sugar, cardamom, milk, yeast, salt",
    ratings: { average: 4.4, count: 389 },
  },
  "chocolate-shake": {
    _id: "13", name: "Chocolate Shake", slug: "chocolate-shake",
    description: "Thick and creamy chocolate milkshake made with real chocolate and full-cream milk. Blended to perfection for a smooth, velvety texture. Topped with whipped cream and chocolate drizzle. A chocolate lover's dream beverage.",
    shortDescription: "Thick & creamy chocolate milkshake",
    category: { name: "Beverages", slug: "beverages" },
    images: [
      { url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80", alt: "Chocolate shake", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80", alt: "Shake close-up", isPrimary: false },
    ],
    variants: [
      { _id: "v13a", size: "Regular (300ml)", weight: "300ml", price: 149 },
      { _id: "v13b", size: "Large (500ml)", weight: "500ml", price: 219 },
    ],
    dietaryTags: ["veg"],
    shelfLife: "Serve immediately",
    ingredients: "Milk, chocolate syrup, cocoa powder, sugar, whipped cream, ice cream",
    ratings: { average: 4.6, count: 234 },
  },
  "cold-coffee": {
    _id: "14", name: "Cold Coffee", slug: "cold-coffee",
    description: "Creamy, refreshing cold coffee made with premium Arabica beans and full-cream milk. Blended with ice cream for extra richness. The perfect pick-me-up on a warm day. Smooth, frothy, and irresistibly delicious.",
    shortDescription: "Creamy cold coffee with Arabica beans",
    category: { name: "Beverages", slug: "beverages" },
    images: [
      { url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80", alt: "Cold coffee", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80", alt: "Coffee close-up", isPrimary: false },
    ],
    variants: [
      { _id: "v14a", size: "Regular (300ml)", weight: "300ml", price: 129 },
      { _id: "v14b", size: "Large (500ml)", weight: "500ml", price: 189 },
    ],
    dietaryTags: ["veg"],
    shelfLife: "Serve immediately",
    ingredients: "Arabica coffee, milk, sugar, ice cream, ice",
    ratings: { average: 4.5, count: 312 },
  },
  "fresh-orange-juice": {
    _id: "15", name: "Fresh Orange Juice", slug: "fresh-orange-juice",
    description: "Freshly squeezed orange juice with no added sugar or preservatives. Made from hand-picked, juicy oranges for a naturally sweet and tangy flavour. Rich in Vitamin C and perfect for a healthy start to your day.",
    shortDescription: "Freshly squeezed orange juice, no sugar",
    category: { name: "Beverages", slug: "beverages" },
    images: [
      { url: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=800&q=80", alt: "Fresh orange juice", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80", alt: "Juice glass", isPrimary: false },
    ],
    variants: [
      { _id: "v15a", size: "300ml", weight: "300ml", price: 99 },
      { _id: "v15b", size: "500ml", weight: "500ml", price: 149 },
    ],
    dietaryTags: ["veg"],
    shelfLife: "Serve immediately",
    ingredients: "Fresh oranges",
    ratings: { average: 4.3, count: 145 },
  },
  "classic-veg-burger": {
    _id: "16", name: "Classic Veg Burger", slug: "classic-veg-burger",
    description: "A crispy aloo tikki burger loaded with fresh lettuce, tomato, onion rings, and our signature special sauce. Served in a toasted sesame bun. Hearty, filling, and full of flavour — the ultimate vegetarian burger experience.",
    shortDescription: "Crispy aloo tikki burger with special sauce",
    category: { name: "Food Menu", slug: "food-menu" },
    images: [
      { url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", alt: "Veg burger", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80", alt: "Burger side view", isPrimary: false },
    ],
    variants: [
      { _id: "v16a", size: "Regular", weight: "200g", price: 129 },
      { _id: "v16b", size: "Double Patty", weight: "300g", price: 179 },
    ],
    dietaryTags: ["veg"],
    shelfLife: "Serve immediately",
    ingredients: "Potato patty, sesame bun, lettuce, tomato, onion, pickles, special sauce, cheese",
    ratings: { average: 4.2, count: 278 },
  },
  "margherita-pizza": {
    _id: "17", name: "Margherita Pizza", slug: "margherita-pizza",
    description: "Classic thin-crust Margherita pizza with San Marzano-style tomato sauce, fresh mozzarella cheese, and fragrant basil leaves. Hand-stretched dough baked in a high-temperature oven for the perfect crispy-yet-chewy crust.",
    shortDescription: "Classic thin-crust Margherita pizza",
    category: { name: "Food Menu", slug: "food-menu" },
    images: [
      { url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80", alt: "Margherita pizza", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", alt: "Pizza slice", isPrimary: false },
    ],
    variants: [
      { _id: "v17a", size: "Regular (8\")", weight: "300g", price: 199 },
      { _id: "v17b", size: "Medium (10\")", weight: "450g", price: 349 },
      { _id: "v17c", size: "Large (12\")", weight: "600g", price: 449 },
    ],
    dietaryTags: ["veg"],
    shelfLife: "Serve immediately",
    ingredients: "Pizza dough, tomato sauce, mozzarella cheese, fresh basil, olive oil, oregano",
    ratings: { average: 4.4, count: 456 },
  },
  "paneer-tikka-sandwich": {
    _id: "18", name: "Paneer Tikka Sandwich", slug: "paneer-tikka-sandwich",
    description: "Grilled paneer tikka stuffed in a toasted multigrain sandwich with mint chutney, onions, and bell peppers. Marinated in traditional tikka spices and grilled to perfection. A fusion favourite that brings together the best of Indian and Western flavours.",
    shortDescription: "Grilled paneer tikka multigrain sandwich",
    category: { name: "Food Menu", slug: "food-menu" },
    images: [
      { url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80", alt: "Paneer tikka sandwich", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80", alt: "Sandwich cross-section", isPrimary: false },
    ],
    variants: [
      { _id: "v18a", size: "Regular", weight: "200g", price: 149 },
      { _id: "v18b", size: "Double", weight: "350g", price: 249 },
    ],
    dietaryTags: ["veg"],
    shelfLife: "Serve immediately",
    ingredients: "Multigrain bread, paneer, tikka masala, bell peppers, onion, mint chutney, butter",
    ratings: { average: 4.3, count: 167 },
  },
  "diwali-premium-gift-hamper": {
    _id: "19", name: "Diwali Premium Gift Hamper", slug: "diwali-premium-gift-hamper",
    description: "A premium Diwali gift hamper packed with an assortment of our finest treats. Includes handcrafted chocolates, cookies, dry fruit cake, kaju katli, and flavoured nuts — all beautifully packaged in an elegant gift box. Perfect for corporate gifting or sharing with loved ones.",
    shortDescription: "Premium Diwali gift box with assorted treats",
    category: { name: "Bakery", slug: "bakery" },
    images: [
      { url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&q=80", alt: "Diwali gift hamper", isPrimary: true },
      { url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&q=80", alt: "Gift box contents", isPrimary: false },
    ],
    variants: [
      { _id: "v19a", size: "Standard", weight: "750g", price: 999, compareAtPrice: 1299 },
      { _id: "v19b", size: "Premium", weight: "1.5kg", price: 1799, compareAtPrice: 2299 },
    ],
    dietaryTags: ["eggless", "veg"],
    shelfLife: "15 days (cool, dry place)",
    ingredients: "Assorted chocolates, cookies, dry fruit cake, kaju katli, flavoured nuts, gift box packaging",
    ratings: { average: 4.8, count: 89 },
  },
};

// Category-based related products for recommendations
const categoryRelated: Record<string, string[]> = {
  cakes: ["classic-chocolate-truffle-cake", "red-velvet-dream-cake", "butterscotch-crunch-cake", "black-forest-cake", "pineapple-fresh-cream-cake", "mango-delight-cake"],
  bakery: ["chocolate-chip-cookies-pack", "classic-fudge-brownie", "butter-croissant", "honey-almond-tea-cake", "multigrain-bread-loaf", "elaichi-rusk", "diwali-premium-gift-hamper"],
  beverages: ["chocolate-shake", "cold-coffee", "fresh-orange-juice"],
  "food-menu": ["classic-veg-burger", "margherita-pizza", "paneer-tikka-sandwich"],
};

function getRelatedProducts(currentSlug: string, categorySlug: string) {
  const slugs = (categoryRelated[categorySlug] || Object.values(categoryRelated).flat())
    .filter((s) => s !== currentSlug)
    .slice(0, 4);
  return slugs.map((s) => demoProducts[s]).filter(Boolean).map((p) => ({
    _id: p._id, name: p.name, slug: p.slug, shortDescription: p.shortDescription,
    images: [p.images[0]], variants: [p.variants[0]], dietaryTags: p.dietaryTags, ratings: p.ratings,
  }));
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = demoProducts[slug];
  const addItem = useCartStore((s) => s.addItem);

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="font-display text-2xl font-bold text-text-primary mb-2">Product Not Found</h1>
        <p className="text-text-muted mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Button href="/">Back to Home</Button>
      </div>
    );
  }

  const variant = product.variants[selectedVariant];
  const discount = variant.compareAtPrice
    ? Math.round(((variant.compareAtPrice - variant.price) / variant.compareAtPrice) * 100)
    : null;

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      variantId: variant._id,
      name: product.name,
      image: product.images[0].url,
      size: variant.size,
      price: variant.price,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Breadcrumb
        items={[
          { label: product.category.name, href: `/category/${product.category.slug}` },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-16">
        {/* Images */}
        <div>
          <div className="relative aspect-square rounded-brand overflow-hidden bg-brand-cream mb-4">
            <Image
              src={product.images[selectedImage].url}
              alt={product.images[selectedImage].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === i ? "border-brand-red" : "border-transparent"
                  }`}
                >
                  <Image src={img.url} alt={img.alt} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Dietary badges */}
          <div className="flex gap-2 mb-3">
            {product.dietaryTags.map((tag) => (
              <Badge key={tag} type={tag as "veg" | "eggless"} size="md" />
            ))}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-2">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded">
              <Star size={14} className="fill-green-600 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                {product.ratings.average}
              </span>
            </div>
            <span className="text-sm text-text-muted">
              ({product.ratings.count} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-brand-red">₹{variant.price}</span>
            {variant.compareAtPrice && (
              <>
                <span className="text-lg text-text-muted line-through">
                  ₹{variant.compareAtPrice}
                </span>
                <span className="bg-brand-red/10 text-brand-red text-sm font-semibold px-2 py-0.5 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Variants */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-text-primary mb-3">
              Size / Weight
            </p>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((v, i) => (
                <button
                  key={v._id}
                  onClick={() => setSelectedVariant(i)}
                  className={`px-4 py-2.5 rounded-brand border-2 text-sm font-medium transition-all ${
                    selectedVariant === i
                      ? "border-brand-red bg-brand-red/5 text-brand-red"
                      : "border-brand-sage/30 text-text-secondary hover:border-brand-red/50"
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-text-primary mb-3">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 flex items-center justify-center border border-brand-sage/50 rounded-brand hover:border-brand-red transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center border border-brand-sage/50 rounded-brand hover:border-brand-red transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button size="lg" fullWidth onClick={handleAddToCart} className="mb-6">
            <ShoppingBag size={20} className="mr-2" />
            Add to Cart — ₹{variant.price * quantity}
          </Button>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-brand-cream/50 rounded-brand mb-6">
            <div className="text-center">
              <Truck size={20} className="mx-auto text-brand-red mb-1" />
              <p className="text-xs text-text-muted">Free delivery above ₹499</p>
            </div>
            <div className="text-center">
              <Shield size={20} className="mx-auto text-brand-red mb-1" />
              <p className="text-xs text-text-muted">100% fresh guarantee</p>
            </div>
            <div className="text-center">
              <Clock size={20} className="mx-auto text-brand-red mb-1" />
              <p className="text-xs text-text-muted">Same day delivery</p>
            </div>
          </div>

          {/* Subscribe & Save */}
          <div className="mb-6">
            <SubscribeAndSave
              productName={product.name}
              price={variant.price}
              productSlug={product.slug}
            />
          </div>

          {/* Description */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-text-primary mb-2">Description</h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {product.description}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-2">Ingredients</h3>
              <p className="text-sm text-text-secondary">{product.ingredients}</p>
            </div>
            <div>
              <h3 className="font-semibold text-text-primary mb-2">Shelf Life</h3>
              <p className="text-sm text-text-secondary">{product.shelfLife}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <section className="pb-16">
        <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {getRelatedProducts(slug, product.category.slug).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
