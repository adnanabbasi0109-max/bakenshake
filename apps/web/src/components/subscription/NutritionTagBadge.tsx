"use client";

const TAG_CONFIG: Record<string, { label: string; color: string }> = {
  high_protein: { label: "High Protein", color: "#DC2626" },
  low_sugar: { label: "Low Sugar", color: "#059669" },
  low_carb: { label: "Low Carb", color: "#7C3AED" },
  high_fiber: { label: "High Fiber", color: "#D97706" },
  keto_friendly: { label: "Keto", color: "#2563EB" },
  gluten_free: { label: "Gluten Free", color: "#16A34A" },
  sugar_free: { label: "Sugar Free", color: "#0891B2" },
  whole_grain: { label: "Whole Grain", color: "#92400E" },
  low_calorie: { label: "Low Calorie", color: "#E11D48" },
  vegan: { label: "Vegan", color: "#059669" },
  organic: { label: "Organic", color: "#15803D" },
};

interface NutritionTagBadgeProps {
  tag: string;
}

export default function NutritionTagBadge({ tag }: NutritionTagBadgeProps) {
  const config = TAG_CONFIG[tag];

  if (!config) return null;

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-body"
      style={{
        backgroundColor: `${config.color}26`,
        color: config.color,
      }}
    >
      {config.label}
    </span>
  );
}
