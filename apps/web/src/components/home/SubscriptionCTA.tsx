"use client";

import { Repeat, Truck, Heart } from "lucide-react";
import Button from "@/components/ui/Button";

const features = [
  { icon: Repeat, text: "Weekly, biweekly, or monthly" },
  { icon: Truck, text: "Free delivery on orders above ₹499" },
  { icon: Heart, text: "Customized to your health goals" },
];

export default function SubscriptionCTA() {
  return (
    <section className="py-12 md:py-16 bg-brand-sage/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-brand p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-8">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-3">
              Health Food Subscriptions
            </h2>
            <p className="text-text-secondary font-body mb-6 max-w-lg">
              Get curated boxes of protein-packed, low-sugar, and wholesome
              baked goods delivered regularly. Save 10% on every delivery.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              {features.map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-2 bg-brand-cream px-3 py-1.5 rounded-full text-sm font-body text-text-secondary"
                >
                  <f.icon size={14} className="text-brand-red" />
                  {f.text}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <Button href="/subscriptions" variant="primary" size="md">
                Browse Plans
              </Button>
              <Button
                href="/subscriptions/build-your-own"
                variant="outline"
                size="md"
              >
                Build Your Own
              </Button>
            </div>
          </div>

          {/* Visual */}
          <div className="flex-shrink-0 w-48 h-48 md:w-56 md:h-56 bg-brand-cream rounded-full flex items-center justify-center">
            <div className="text-center">
              <span className="block font-display text-3xl md:text-4xl font-bold text-brand-red">
                10%
              </span>
              <span className="block text-sm font-body text-text-muted mt-1">
                off every
                <br />
                delivery
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
