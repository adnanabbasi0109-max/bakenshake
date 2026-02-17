"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useCartStore } from "@/store/cartStore";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    shortDescription?: string;
    images: { url: string; alt?: string; isPrimary: boolean }[];
    variants: { _id?: string; size: string; price: number; compareAtPrice?: number }[];
    dietaryTags: string[];
    ratings: { average: number; count: number };
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const primaryImage = product.images.find((i) => i.isPrimary) || product.images[0];
  const firstVariant = product.variants[0];
  const discount = firstVariant.compareAtPrice
    ? Math.round(
        ((firstVariant.compareAtPrice - firstVariant.price) / firstVariant.compareAtPrice) * 100
      )
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product._id,
      variantId: firstVariant._id || "default",
      name: product.name,
      image: primaryImage?.url || "",
      size: firstVariant.size,
      price: firstVariant.price,
    });
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="bg-white rounded-brand overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-brand-cream">
          {primaryImage && (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          {/* Discount badge */}
          {discount && (
            <span className="absolute top-3 left-3 bg-brand-red text-white text-xs font-bold px-2 py-1 rounded-brand">
              {discount}% OFF
            </span>
          )}
          {/* Dietary badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {product.dietaryTags.map((tag) => (
              <Badge key={tag} type={tag as "veg" | "eggless" | "contains-egg" | "non-veg"} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-3 md:p-4">
          <h3 className="font-semibold text-text-primary text-sm md:text-base line-clamp-1 group-hover:text-brand-red transition-colors">
            {product.name}
          </h3>
          {product.shortDescription && (
            <p className="text-text-muted text-xs mt-1 line-clamp-1">
              {product.shortDescription}
            </p>
          )}

          {/* Rating */}
          {product.ratings.count > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-text-secondary font-medium">
                {product.ratings.average}
              </span>
              <span className="text-xs text-text-muted">({product.ratings.count})</span>
            </div>
          )}

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between mt-3">
            <div>
              <span className="text-lg font-bold text-brand-red">
                ₹{firstVariant.price}
              </span>
              {firstVariant.compareAtPrice && (
                <span className="text-sm text-text-muted line-through ml-2">
                  ₹{firstVariant.compareAtPrice}
                </span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-brand-red text-white p-2 rounded-brand hover:bg-brand-red-dark transition-colors active:scale-95"
              aria-label="Add to cart"
            >
              <ShoppingBag size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
