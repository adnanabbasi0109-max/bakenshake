"use client";
import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/common/Breadcrumb";
import ProductGrid from "@/components/product/ProductGrid";
import FilterSidebar from "@/components/product/FilterSidebar";

// Static demo data — will be replaced by API calls
const demoCategoryData: Record<string, { name: string; banner: string; products: Array<{
  _id: string; name: string; slug: string; shortDescription?: string;
  images: { url: string; alt?: string; isPrimary: boolean }[];
  variants: { _id?: string; size: string; price: number; compareAtPrice?: number }[];
  dietaryTags: string[]; ratings: { average: number; count: number };
}> }> = {
  cakes: {
    name: "Cakes",
    banner: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=1200&q=80",
    products: [
      { _id: "1", name: "Classic Chocolate Truffle Cake", slug: "classic-chocolate-truffle-cake", shortDescription: "Rich chocolate truffle cake with Belgian cocoa", images: [{ url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80", alt: "Chocolate truffle cake", isPrimary: true }], variants: [{ _id: "v1", size: "0.5 kg", price: 449, compareAtPrice: 549 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.7, count: 234 } },
      { _id: "2", name: "Red Velvet Dream Cake", slug: "red-velvet-dream-cake", shortDescription: "Classic red velvet with cream cheese frosting", images: [{ url: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&q=80", alt: "Red velvet cake", isPrimary: true }], variants: [{ _id: "v2", size: "0.5 kg", price: 499, compareAtPrice: 599 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.8, count: 189 } },
      { _id: "3", name: "Butterscotch Crunch Cake", slug: "butterscotch-crunch-cake", shortDescription: "Butterscotch cake with praline crunch topping", images: [{ url: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80", alt: "Butterscotch cake", isPrimary: true }], variants: [{ _id: "v3", size: "0.5 kg", price: 399, compareAtPrice: 499 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.5, count: 156 } },
      { _id: "4", name: "Black Forest Cake", slug: "black-forest-cake", shortDescription: "Classic Black Forest with cherries & cream", images: [{ url: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&q=80", alt: "Black Forest cake", isPrimary: true }], variants: [{ _id: "v4", size: "0.5 kg", price: 449 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.6, count: 312 } },
      { _id: "5", name: "Pineapple Fresh Cream Cake", slug: "pineapple-fresh-cream-cake", shortDescription: "Fresh pineapple cake with whipped cream", images: [{ url: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80", alt: "Pineapple cake", isPrimary: true }], variants: [{ _id: "v5", size: "0.5 kg", price: 349 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.4, count: 198 } },
      { _id: "6", name: "Mango Delight Cake", slug: "mango-delight-cake", shortDescription: "Fresh Alphonso mango layered cake", images: [{ url: "https://images.unsplash.com/photo-1557979619-445218f326b9?w=600&q=80", alt: "Mango cake", isPrimary: true }], variants: [{ _id: "v6", size: "0.5 kg", price: 499 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.9, count: 89 } },
    ],
  },
  bakery: {
    name: "Bakery",
    banner: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1200&q=80",
    products: [
      { _id: "7", name: "Chocolate Chip Cookies Pack", slug: "chocolate-chip-cookies-pack", shortDescription: "Classic chocolate chip cookies, pack of 12", images: [{ url: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80", alt: "Chocolate chip cookies", isPrimary: true }], variants: [{ _id: "v7", size: "200g", price: 149, compareAtPrice: 179 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.6, count: 445 } },
      { _id: "8", name: "Classic Fudge Brownie", slug: "classic-fudge-brownie", shortDescription: "Dense dark chocolate fudge brownie", images: [{ url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80", alt: "Fudge brownie", isPrimary: true }], variants: [{ _id: "v8", size: "Single", price: 89 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.8, count: 523 } },
      { _id: "9", name: "Butter Croissant", slug: "butter-croissant", shortDescription: "Freshly baked French butter croissant", images: [{ url: "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=600&q=80", alt: "Butter croissant", isPrimary: true }], variants: [{ _id: "v9", size: "Single", price: 79 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.5, count: 334 } },
      { _id: "10", name: "Honey Almond Tea Cake", slug: "honey-almond-tea-cake", shortDescription: "Moist honey cake with toasted almonds", images: [{ url: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=600&q=80", alt: "Honey almond tea cake", isPrimary: true }], variants: [{ _id: "v10", size: "250g", price: 179 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.7, count: 156 } },
      { _id: "11", name: "Multigrain Bread Loaf", slug: "multigrain-bread-loaf", shortDescription: "Fresh multigrain bread with seeds", images: [{ url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80", alt: "Multigrain bread", isPrimary: true }], variants: [{ _id: "v11", size: "Regular", price: 79 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.5, count: 89 } },
      { _id: "12", name: "Elaichi Rusk", slug: "elaichi-rusk", shortDescription: "Cardamom-flavoured crispy rusk with ghee", images: [{ url: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80", alt: "Elaichi rusk", isPrimary: true }], variants: [{ _id: "v12", size: "300g", price: 99 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.4, count: 389 } },
    ],
  },
  beverages: {
    name: "Beverages",
    banner: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=1200&q=80",
    products: [
      { _id: "13", name: "Chocolate Shake", slug: "chocolate-shake", shortDescription: "Thick & creamy chocolate milkshake", images: [{ url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&q=80", alt: "Chocolate shake", isPrimary: true }], variants: [{ _id: "v13", size: "Regular (300ml)", price: 149 }], dietaryTags: ["veg"], ratings: { average: 4.6, count: 234 } },
      { _id: "14", name: "Cold Coffee", slug: "cold-coffee", shortDescription: "Creamy cold coffee with Arabica beans", images: [{ url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80", alt: "Cold coffee", isPrimary: true }], variants: [{ _id: "v14", size: "Regular (300ml)", price: 129 }], dietaryTags: ["veg"], ratings: { average: 4.5, count: 312 } },
      { _id: "15", name: "Fresh Orange Juice", slug: "fresh-orange-juice", shortDescription: "Freshly squeezed orange juice, no sugar", images: [{ url: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80", alt: "Fresh orange juice", isPrimary: true }], variants: [{ _id: "v15", size: "300ml", price: 99 }], dietaryTags: ["veg"], ratings: { average: 4.3, count: 145 } },
    ],
  },
  "food-menu": {
    name: "Food Menu",
    banner: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80",
    products: [
      { _id: "16", name: "Classic Veg Burger", slug: "classic-veg-burger", shortDescription: "Crispy aloo tikki burger with special sauce", images: [{ url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", alt: "Veg burger", isPrimary: true }], variants: [{ _id: "v16", size: "Regular", price: 129 }], dietaryTags: ["veg"], ratings: { average: 4.2, count: 278 } },
      { _id: "17", name: "Margherita Pizza", slug: "margherita-pizza", shortDescription: "Classic thin-crust Margherita pizza", images: [{ url: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80", alt: "Margherita pizza", isPrimary: true }], variants: [{ _id: "v17", size: "Regular (8\")", price: 199 }], dietaryTags: ["veg"], ratings: { average: 4.4, count: 456 } },
      { _id: "18", name: "Paneer Tikka Sandwich", slug: "paneer-tikka-sandwich", shortDescription: "Grilled paneer tikka multigrain sandwich", images: [{ url: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&q=80", alt: "Paneer tikka sandwich", isPrimary: true }], variants: [{ _id: "v18", size: "Regular", price: 149 }], dietaryTags: ["veg"], ratings: { average: 4.3, count: 167 } },
    ],
  },
};

// Fallback for unknown categories
const defaultCategory = {
  name: "Products",
  banner: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
  products: [],
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = demoCategoryData[slug] || defaultCategory;

  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [selectedSort, setSelectedSort] = useState("relevance");

  // Client-side filtering for demo
  let filteredProducts = [...data.products];

  if (selectedDietary.length > 0) {
    filteredProducts = filteredProducts.filter((p) =>
      selectedDietary.some((d) => p.dietaryTags.includes(d))
    );
  }

  if (selectedPriceRange) {
    filteredProducts = filteredProducts.filter((p) => {
      const price = p.variants[0].price;
      return price >= selectedPriceRange.min && price <= selectedPriceRange.max;
    });
  }

  if (selectedSort === "price-low") {
    filteredProducts.sort((a, b) => a.variants[0].price - b.variants[0].price);
  } else if (selectedSort === "price-high") {
    filteredProducts.sort((a, b) => b.variants[0].price - a.variants[0].price);
  } else if (selectedSort === "rating") {
    filteredProducts.sort((a, b) => b.ratings.average - a.ratings.average);
  }

  return (
    <div>
      {/* Category Banner */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <Image
          src={data.banner}
          alt={data.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              {data.name}
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {filteredProducts.length} products
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumb
          items={[{ label: data.name }]}
        />

        <div className="flex gap-8 pb-16">
          <FilterSidebar
            selectedDietary={selectedDietary}
            selectedPriceRange={selectedPriceRange}
            selectedSort={selectedSort}
            onDietaryChange={setSelectedDietary}
            onPriceRangeChange={setSelectedPriceRange}
            onSortChange={setSelectedSort}
            onClear={() => {
              setSelectedDietary([]);
              setSelectedPriceRange(null);
              setSelectedSort("relevance");
            }}
          />
          <div className="flex-1">
            <ProductGrid products={filteredProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
