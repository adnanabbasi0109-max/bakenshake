"use client";
import ProductCard from "./ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

interface Product {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  images: { url: string; alt?: string; isPrimary: boolean }[];
  variants: { _id?: string; size: string; price: number; compareAtPrice?: number }[];
  dietaryTags: string[];
  ratings: { average: number; count: number };
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-display text-2xl text-text-primary mb-2">No products found</p>
        <p className="text-text-muted">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
