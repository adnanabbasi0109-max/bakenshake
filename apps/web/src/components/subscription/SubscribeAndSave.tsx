"use client";

import { useState } from "react";
import { Repeat, Check } from "lucide-react";
import Button from "@/components/ui/Button";

interface SubscribeAndSaveProps {
  productName: string;
  price: number;
  productSlug: string;
}

const FREQUENCIES = [
  { value: "weekly", label: "Weekly", discount: 10 },
  { value: "biweekly", label: "Every 2 Weeks", discount: 10 },
  { value: "monthly", label: "Monthly", discount: 10 },
];

export default function SubscribeAndSave({
  productName,
  price,
  productSlug: _productSlug,
}: SubscribeAndSaveProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedFreq, setSelectedFreq] = useState("monthly");

  const freq = FREQUENCIES.find((f) => f.value === selectedFreq)!;
  const discountedPrice = Math.round(price * (1 - freq.discount / 100));
  const savings = price - discountedPrice;

  return (
    <div className="border border-brand-sage/30 rounded-brand overflow-hidden">
      {/* Toggle Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-brand-cream/50 hover:bg-brand-cream transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Repeat size={16} className="text-brand-red" />
          <span className="font-body font-semibold text-sm text-text-primary">
            Subscribe & Save {freq.discount}%
          </span>
        </div>
        <span className="text-xs font-body text-green-600 font-semibold">
          Save ₹{savings}/delivery
        </span>
      </button>

      {/* Expanded Content */}
      {expanded && (
        <div className="px-4 py-4 space-y-3 border-t border-brand-sage/20">
          <p className="text-xs text-text-muted font-body">
            Get <strong>{productName}</strong> delivered regularly and save on
            every order.
          </p>

          {/* Frequency Options */}
          <div className="space-y-2">
            {FREQUENCIES.map((f) => {
              const isSelected = selectedFreq === f.value;
              const fPrice = Math.round(price * (1 - f.discount / 100));

              return (
                <button
                  key={f.value}
                  onClick={() => setSelectedFreq(f.value)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-brand border text-sm font-body transition-all cursor-pointer ${
                    isSelected
                      ? "border-brand-red bg-brand-red/5"
                      : "border-brand-sage/30 hover:border-brand-sage/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-brand-red bg-brand-red"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <Check size={10} className="text-white" />
                      )}
                    </div>
                    <span
                      className={
                        isSelected ? "text-brand-red font-semibold" : "text-text-primary"
                      }
                    >
                      {f.label}
                    </span>
                  </div>
                  <span className="font-semibold text-brand-red">
                    ₹{fPrice.toLocaleString("en-IN")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Subscribe Button */}
          <Button variant="primary" size="sm" fullWidth>
            Subscribe — ₹{discountedPrice.toLocaleString("en-IN")}/
            {selectedFreq === "weekly"
              ? "week"
              : selectedFreq === "biweekly"
              ? "2 weeks"
              : "month"}
          </Button>

          <p className="text-[11px] text-text-muted font-body text-center">
            Cancel or pause anytime. Free delivery above ₹499.
          </p>
        </div>
      )}
    </div>
  );
}
