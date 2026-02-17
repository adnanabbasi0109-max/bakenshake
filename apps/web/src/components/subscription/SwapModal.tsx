"use client";

import { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import Modal from "@/components/ui/Modal";
import NutritionTagBadge from "@/components/subscription/NutritionTagBadge";

interface SwapProduct {
  productId: string;
  name: string;
  image: string;
  price: number;
  tags: string[];
  variantIndex: number;
}

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProductId: string;
  planSlug: string;
  onSwapConfirm: (newProductId: string, newVariantIndex: number) => void;
}

// Static demo data for eligible swap products
export const DEMO_PRODUCTS: SwapProduct[] = [
  {
    productId: "prod_001",
    name: "Multigrain Protein Cookie",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&q=80",
    price: 120,
    tags: ["high_protein", "whole_grain"],
    variantIndex: 0,
  },
  {
    productId: "prod_002",
    name: "Sugar-Free Almond Brownie",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&q=80",
    price: 150,
    tags: ["sugar_free", "low_carb"],
    variantIndex: 0,
  },
  {
    productId: "prod_003",
    name: "Oats & Raisin Energy Bar",
    image: "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=200&q=80",
    price: 90,
    tags: ["high_fiber", "low_sugar"],
    variantIndex: 0,
  },
  {
    productId: "prod_004",
    name: "Keto Chocolate Muffin",
    image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200&q=80",
    price: 180,
    tags: ["keto_friendly", "sugar_free"],
    variantIndex: 0,
  },
  {
    productId: "prod_005",
    name: "Vegan Banana Bread",
    image: "https://images.unsplash.com/photo-1632931057819-4eefffa8e007?w=200&q=80",
    price: 160,
    tags: ["vegan", "organic"],
    variantIndex: 0,
  },
  {
    productId: "prod_006",
    name: "Gluten-Free Coconut Biscuit",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200&q=80",
    price: 100,
    tags: ["gluten_free", "low_calorie"],
    variantIndex: 0,
  },
];

export default function SwapModal({
  isOpen,
  onClose,
  currentProductId,
  planSlug: _planSlug,
  onSwapConfirm,
}: SwapModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = DEMO_PRODUCTS.filter(
    (p) =>
      p.productId !== currentProductId &&
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (product: SwapProduct) => {
    onSwapConfirm(product.productId, product.variantIndex);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Swap Item">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-brand border border-brand-sage/30 text-sm font-body text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/30 transition-colors"
          />
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
          {filteredProducts.map((product) => (
            <button
              key={product.productId}
              onClick={() => handleSelect(product)}
              className="flex flex-col items-start p-3 rounded-brand border border-brand-sage/20 hover:border-brand-red hover:shadow-sm transition-all cursor-pointer text-left bg-white"
            >
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-brand-cream mb-2">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="150px"
                  className="object-cover"
                />
              </div>
              <h4 className="font-body font-semibold text-sm text-text-primary line-clamp-2 leading-snug">
                {product.name}
              </h4>
              <span className="text-sm font-bold text-brand-red mt-1">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {product.tags.map((tag) => (
                    <NutritionTagBadge key={tag} tag={tag} />
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-6 text-text-muted font-body text-sm">
            No matching products found.
          </div>
        )}
      </div>
    </Modal>
  );
}
