"use client";

import BasketItem from "@/components/subscription/BasketItem";

interface BasketItemData {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  isSwappable?: boolean;
}

interface BasketPreviewProps {
  items: BasketItemData[];
  onSwap?: (productId: string) => void;
  title?: string;
}

export default function BasketPreview({ items, onSwap, title }: BasketPreviewProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted font-body text-sm">
        No items in this basket yet.
      </div>
    );
  }

  return (
    <section>
      {title && (
        <h3 className="font-display text-lg font-bold text-text-primary mb-3">
          {title}
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((item) => (
          <BasketItem
            key={item.productId}
            item={item}
            onSwap={onSwap ? () => onSwap(item.productId) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
