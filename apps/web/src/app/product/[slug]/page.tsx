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
};

// Fallback product
const fallbackProduct = {
  _id: "0", name: "Product", slug: "product",
  description: "Product description", shortDescription: "Short description",
  category: { name: "Category", slug: "category" },
  images: [{ url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80", alt: "Product", isPrimary: true }],
  variants: [{ _id: "v0", size: "Regular", weight: "500g", price: 499 }],
  dietaryTags: ["veg"], shelfLife: "2 days", ingredients: "Premium ingredients",
  ratings: { average: 4.5, count: 100 },
};

const relatedProducts = [
  { _id: "r1", name: "Red Velvet Dream Cake", slug: "red-velvet-dream-cake", shortDescription: "Classic red velvet with cream cheese frosting", images: [{ url: "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=600&q=80", alt: "Red velvet cake", isPrimary: true }], variants: [{ _id: "rv1", size: "0.5 kg", price: 499, compareAtPrice: 599 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.8, count: 189 } },
  { _id: "r2", name: "Black Forest Cake", slug: "black-forest-cake", shortDescription: "Classic Black Forest with cherries & cream", images: [{ url: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&q=80", alt: "Black Forest cake", isPrimary: true }], variants: [{ _id: "rv2", size: "0.5 kg", price: 449 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.6, count: 312 } },
  { _id: "r3", name: "Butterscotch Crunch Cake", slug: "butterscotch-crunch-cake", shortDescription: "Butterscotch cake with praline crunch topping", images: [{ url: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&q=80", alt: "Butterscotch cake", isPrimary: true }], variants: [{ _id: "rv3", size: "0.5 kg", price: 399, compareAtPrice: 499 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.5, count: 156 } },
  { _id: "r4", name: "Mango Delight Cake", slug: "mango-delight-cake", shortDescription: "Fresh Alphonso mango layered cake", images: [{ url: "https://images.unsplash.com/photo-1557979619-445218f326b9?w=600&q=80", alt: "Mango cake", isPrimary: true }], variants: [{ _id: "rv4", size: "0.5 kg", price: 499 }], dietaryTags: ["eggless", "veg"], ratings: { average: 4.9, count: 89 } },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = demoProducts[slug] || fallbackProduct;
  const addItem = useCartStore((s) => s.addItem);

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

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
          {relatedProducts.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
