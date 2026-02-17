"use client";
import { useCakeBuilderStore, CakeShape, CakeSize } from "@/store/cakeBuilderStore";

const shapes: { value: CakeShape; label: string; icon: string }[] = [
  { value: "round", label: "Round", icon: "⬤" },
  { value: "square", label: "Square", icon: "⬛" },
  { value: "heart", label: "Heart", icon: "♥" },
  { value: "rectangle", label: "Rectangle", icon: "▬" },
  { value: "tiered-2", label: "2-Tier", icon: "🎂" },
  { value: "tiered-3", label: "3-Tier", icon: "🎂" },
];

const sizes: { value: CakeSize; label: string; serves: string }[] = [
  { value: "0.5 kg", label: "0.5 kg", serves: "4-6 people" },
  { value: "1 kg", label: "1 kg", serves: "8-10 people" },
  { value: "1.5 kg", label: "1.5 kg", serves: "12-15 people" },
  { value: "2 kg", label: "2 kg", serves: "16-20 people" },
  { value: "3 kg", label: "3 kg", serves: "25-30 people" },
  { value: "5 kg", label: "5 kg", serves: "40-50 people" },
];

export default function ShapeAndSizeStep() {
  const { specifications, updateSpec } = useCakeBuilderStore();

  return (
    <div className="space-y-8">
      {/* Shape */}
      <div>
        <h3 className="font-display text-xl font-bold text-text-primary mb-2">
          Choose Your Shape
        </h3>
        <p className="text-text-muted text-sm mb-4">Select the perfect shape for your cake</p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {shapes.map((shape) => (
            <button
              key={shape.value}
              onClick={() => updateSpec("shape", shape.value)}
              className={`flex flex-col items-center gap-2 p-4 rounded-brand border-2 transition-all hover:shadow-md ${
                specifications.shape === shape.value
                  ? "border-brand-red bg-brand-red/5 shadow-sm"
                  : "border-brand-sage/30 hover:border-brand-red/50"
              }`}
            >
              <span className="text-3xl">{shape.icon}</span>
              <span className="text-sm font-medium">{shape.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="font-display text-xl font-bold text-text-primary mb-2">
          Select Size
        </h3>
        <p className="text-text-muted text-sm mb-4">How big should your cake be?</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sizes.map((size) => (
            <button
              key={size.value}
              onClick={() => updateSpec("size", size.value)}
              className={`text-left p-4 rounded-brand border-2 transition-all hover:shadow-md ${
                specifications.size === size.value
                  ? "border-brand-red bg-brand-red/5 shadow-sm"
                  : "border-brand-sage/30 hover:border-brand-red/50"
              }`}
            >
              <p className="font-bold text-lg">{size.label}</p>
              <p className="text-xs text-text-muted mt-1">Serves {size.serves}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Egg Preference */}
      <div>
        <h3 className="font-display text-xl font-bold text-text-primary mb-2">
          Egg Preference
        </h3>
        <div className="flex gap-3">
          {(["eggless", "egg"] as const).map((pref) => (
            <button
              key={pref}
              onClick={() => updateSpec("eggPreference", pref)}
              className={`flex items-center gap-2 px-6 py-3 rounded-brand border-2 transition-all ${
                specifications.eggPreference === pref
                  ? "border-brand-red bg-brand-red/5"
                  : "border-brand-sage/30 hover:border-brand-red/50"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full ${
                  pref === "eggless" ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span className="font-medium capitalize">{pref}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
