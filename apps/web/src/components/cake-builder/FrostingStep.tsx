"use client";
import { useCakeBuilderStore, FrostingType } from "@/store/cakeBuilderStore";

const frostingTypes: { value: FrostingType; label: string; desc: string }[] = [
  { value: "buttercream", label: "Buttercream", desc: "Smooth, creamy, and easy to decorate" },
  { value: "fondant", label: "Fondant", desc: "Smooth, polished look for designer cakes" },
  { value: "whipped-cream", label: "Whipped Cream", desc: "Light, airy, and fresh" },
  { value: "ganache", label: "Ganache", desc: "Rich, glossy chocolate coating" },
  { value: "cream-cheese", label: "Cream Cheese", desc: "Tangy and delicious, perfect for red velvet" },
];

const colorPresets = [
  { value: "#FFFFFF", label: "White" },
  { value: "#FFB6C1", label: "Pink" },
  { value: "#DC143C", label: "Red" },
  { value: "#87CEEB", label: "Blue" },
  { value: "#9370DB", label: "Purple" },
  { value: "#FFD700", label: "Yellow" },
  { value: "#90EE90", label: "Green" },
  { value: "#2D2D2D", label: "Black" },
  { value: "#FFD700", label: "Gold" },
];

export default function FrostingStep() {
  const { specifications, updateSpec } = useCakeBuilderStore();

  return (
    <div className="space-y-8">
      {/* Frosting Type */}
      <div>
        <h3 className="font-display text-xl font-bold text-text-primary mb-2">
          Frosting Type
        </h3>
        <p className="text-text-muted text-sm mb-4">Choose the outer coating for your cake</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {frostingTypes.map((frost) => (
            <button
              key={frost.value}
              onClick={() => updateSpec("frostingType", frost.value)}
              className={`text-left p-4 rounded-brand border-2 transition-all hover:shadow-md ${
                specifications.frostingType === frost.value
                  ? "border-brand-red bg-brand-red/5 shadow-sm"
                  : "border-brand-sage/30 hover:border-brand-red/50"
              }`}
            >
              <p className="font-semibold">{frost.label}</p>
              <p className="text-xs text-text-muted mt-1">{frost.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Frosting Color */}
      <div>
        <h3 className="font-display text-xl font-bold text-text-primary mb-2">
          Frosting Colour
        </h3>
        <p className="text-text-muted text-sm mb-4">Pick a colour or use the custom picker</p>
        <div className="flex flex-wrap gap-3 mb-4">
          {colorPresets.map((color) => (
            <button
              key={color.value + color.label}
              onClick={() => updateSpec("frostingColor", color.value)}
              className={`w-12 h-12 rounded-full border-3 transition-all hover:scale-110 ${
                specifications.frostingColor === color.value
                  ? "border-brand-red ring-2 ring-brand-red/30 scale-110"
                  : "border-gray-200"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.label}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-text-secondary">Custom colour:</label>
          <input
            type="color"
            value={specifications.frostingColor}
            onChange={(e) => updateSpec("frostingColor", e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-0"
          />
          <span className="text-xs text-text-muted font-mono">
            {specifications.frostingColor}
          </span>
        </div>
      </div>
    </div>
  );
}
