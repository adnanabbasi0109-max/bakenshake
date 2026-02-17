"use client";
import { useEffect } from "react";
import { useCakeBuilderStore } from "@/store/cakeBuilderStore";

// Client-side price calculation (mirrors backend logic)
function calculatePrice(specs: ReturnType<typeof useCakeBuilderStore.getState>["specifications"]) {
  const basePrices: Record<string, number> = {
    "0.5 kg": 399, "1 kg": 749, "1.5 kg": 1099,
    "2 kg": 1449, "3 kg": 2149, "5 kg": 3499,
  };
  const flavorMul: Record<string, number> = {
    vanilla: 1.0, chocolate: 1.1, "red-velvet": 1.2, butterscotch: 1.05,
    "black-forest": 1.15, pineapple: 1.0, mango: 1.25, strawberry: 1.15,
    "coffee-mocha": 1.15, fruit: 1.1,
  };
  const frostingMul: Record<string, number> = {
    buttercream: 1.0, fondant: 1.4, "whipped-cream": 0.9, ganache: 1.2, "cream-cheese": 1.15,
  };
  const shapeSurcharge: Record<string, number> = {
    round: 0, square: 50, heart: 100, rectangle: 50, "tiered-2": 500, "tiered-3": 1200,
  };
  const toppingPrices: Record<string, number> = {
    "fresh-fruits": 100, "chocolate-shavings": 50, sprinkles: 30,
    "edible-flowers": 150, nuts: 80, macarons: 200,
    "fondant-figures": 300, "gold-silver-leaf": 250,
  };
  const fillingPrices: Record<string, number> = {
    none: 0, "chocolate-ganache": 100, "fruit-compote": 120,
    caramel: 80, nutella: 150, cream: 50, jam: 60,
  };

  const base = basePrices[specs.size] || 749;
  const fm = flavorMul[specs.flavor] || 1.0;
  const frm = frostingMul[specs.frostingType] || 1.0;
  const ss = shapeSurcharge[specs.shape] || 0;
  const fp = fillingPrices[specs.filling] || 0;
  const tp = specs.toppings.reduce((s, t) => s + (toppingPrices[t] || 0), 0);

  return {
    basePrice: base,
    flavorMultiplier: fm,
    frostingMultiplier: frm,
    shapeSurcharge: ss,
    fillingPrice: fp,
    toppingsTotal: tp,
    photoSurcharge: 0,
    total: Math.round(base * fm * frm + ss + fp + tp),
  };
}

export default function PriceCalculator() {
  const { specifications, pricing, setPricing } = useCakeBuilderStore();

  // Recalculate on spec changes (client-side instant)
  useEffect(() => {
    const calculated = calculatePrice(specifications);
    setPricing(calculated);
  }, [specifications, setPricing]);

  if (!pricing) return null;

  const hasExtras = pricing.shapeSurcharge > 0 || pricing.fillingPrice > 0 || pricing.toppingsTotal > 0;

  return (
    <div className="bg-white rounded-brand border border-brand-sage/20 p-4">
      <h3 className="font-display text-lg font-bold text-text-primary mb-3">
        Price Breakdown
      </h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-text-secondary">
            Base ({specifications.size} {specifications.flavor.replace(/-/g, " ")})
          </span>
          <span>₹{Math.round(pricing.basePrice * pricing.flavorMultiplier)}</span>
        </div>
        {pricing.frostingMultiplier !== 1 && (
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {specifications.frostingType.replace(/-/g, " ")} frosting
            </span>
            <span>
              x{pricing.frostingMultiplier}
            </span>
          </div>
        )}
        {pricing.shapeSurcharge > 0 && (
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {specifications.shape.replace(/-/g, " ")} shape
            </span>
            <span>+₹{pricing.shapeSurcharge}</span>
          </div>
        )}
        {pricing.fillingPrice > 0 && (
          <div className="flex justify-between">
            <span className="text-text-secondary">
              {specifications.filling.replace(/-/g, " ")} filling
            </span>
            <span>+₹{pricing.fillingPrice}</span>
          </div>
        )}
        {pricing.toppingsTotal > 0 && (
          <div className="flex justify-between">
            <span className="text-text-secondary">Toppings & decorations</span>
            <span>+₹{pricing.toppingsTotal}</span>
          </div>
        )}

        <div className="border-t border-brand-sage/20 pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-brand-red">₹{pricing.total}</span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            +5% GST applicable at checkout
          </p>
        </div>
      </div>
    </div>
  );
}
