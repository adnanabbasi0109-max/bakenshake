"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import NutritionTagBadge from "@/components/subscription/NutritionTagBadge";

interface Plan {
  name: string;
  slug: string;
  shortDescription: string;
  image: string;
  lane: string;
  priceWeekly: number;
  priceMonthly: number;
  targetNutritionTags: string[];
}

interface PlanCardProps {
  plan: Plan;
}

const LANE_LABELS: Record<string, string> = {
  FRESH_CITY_ONLY: "Fresh Local",
  SHELF_STABLE_NATIONAL: "Pan-India",
};

export default function PlanCard({ plan }: PlanCardProps) {
  return (
    <div className="bg-white rounded-brand overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-cream">
        <Image
          src={plan.image}
          alt={plan.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
        {/* Lane badge */}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold font-body text-text-primary px-2.5 py-1 rounded-full shadow-sm">
          {LANE_LABELS[plan.lane] || plan.lane}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-display text-lg font-bold text-text-primary leading-snug">
          {plan.name}
        </h3>
        <p className="text-text-muted text-sm mt-1 line-clamp-2 font-body">
          {plan.shortDescription}
        </p>

        {/* Nutrition tags */}
        {plan.targetNutritionTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {plan.targetNutritionTags.map((tag) => (
              <NutritionTagBadge key={tag} tag={tag} />
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Price */}
        <div className="mt-4">
          <span className="text-lg font-bold text-brand-red font-display">
            ₹{plan.priceWeekly.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-text-muted font-body">/week</span>
        </div>

        {/* CTA */}
        <Button
          href={`/subscriptions/${plan.slug}`}
          variant="outline"
          size="sm"
          fullWidth
          className="mt-3"
        >
          View Plan
        </Button>
      </div>
    </div>
  );
}
