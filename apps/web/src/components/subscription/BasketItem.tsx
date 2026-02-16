"use client";

import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";

interface BasketItemData {
  name: string;
  image: string;
  quantity: number;
  price: number;
  isSwappable?: boolean;
}

interface BasketItemProps {
  item: BasketItemData;
  onSwap?: () => void;
  compact?: boolean;
}

export default function BasketItem({ item, onSwap, compact = false }: BasketItemProps) {
  const imgSize = compact ? 48 : 64;

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-brand border border-brand-sage/20">
      {/* Product image */}
      <div
        className="relative flex-shrink-0 rounded-lg overflow-hidden bg-brand-cream"
        style={{ width: imgSize, height: imgSize }}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes={`${imgSize}px`}
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4
          className={`font-body font-semibold text-text-primary truncate ${
            compact ? "text-xs" : "text-sm"
          }`}
        >
          {item.name}
        </h4>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-text-muted ${compact ? "text-xs" : "text-xs"}`}>
            Qty: {item.quantity}
          </span>
          <span className={`font-semibold text-brand-red ${compact ? "text-xs" : "text-sm"}`}>
            ₹{item.price.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Swap button */}
      {item.isSwappable && onSwap && (
        <button
          onClick={onSwap}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold font-body text-brand-red bg-brand-red/10 rounded-brand hover:bg-brand-red/20 transition-colors cursor-pointer"
        >
          <ArrowLeftRight size={12} />
          Swap
        </button>
      )}
    </div>
  );
}
