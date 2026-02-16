"use client";
import { useCakeBuilderStore, CakeTopping, CakeTheme } from "@/store/cakeBuilderStore";

const toppings: { value: CakeTopping; label: string; price: string }[] = [
  { value: "fresh-fruits", label: "Fresh Fruits", price: "+₹100" },
  { value: "chocolate-shavings", label: "Chocolate Shavings", price: "+₹50" },
  { value: "sprinkles", label: "Sprinkles", price: "+₹30" },
  { value: "edible-flowers", label: "Edible Flowers", price: "+₹150" },
  { value: "nuts", label: "Nuts", price: "+₹80" },
  { value: "macarons", label: "Macarons", price: "+₹200" },
  { value: "fondant-figures", label: "Fondant Figures", price: "+₹300" },
  { value: "gold-silver-leaf", label: "Gold/Silver Leaf", price: "+₹250" },
];

const themes: { value: CakeTheme; label: string }[] = [
  { value: "birthday", label: "Birthday" },
  { value: "wedding", label: "Wedding" },
  { value: "anniversary", label: "Anniversary" },
  { value: "baby-shower", label: "Baby Shower" },
  { value: "graduation", label: "Graduation" },
  { value: "valentine", label: "Valentine's Day" },
  { value: "christmas", label: "Christmas" },
  { value: "diwali", label: "Diwali" },
  { value: "generic-celebration", label: "Celebration" },
];

export default function DecorationsStep() {
  const { specifications, updateSpec, toggleTopping } = useCakeBuilderStore();

  return (
    <div className="space-y-8">
      {/* Theme */}
      <div>
        <h3 className="font-display text-xl font-bold text-text-primary mb-2">
          Select a Theme
        </h3>
        <p className="text-text-muted text-sm mb-4">What&apos;s the occasion?</p>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
          {themes.map((theme) => (
            <button
              key={theme.value}
              onClick={() => updateSpec("theme", theme.value)}
              className={`p-3 rounded-brand border-2 text-sm font-medium transition-all hover:shadow-md ${
                specifications.theme === theme.value
                  ? "border-brand-red bg-brand-red/5 shadow-sm"
                  : "border-brand-sage/30 hover:border-brand-red/50"
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toppings */}
      <div>
        <h3 className="font-display text-xl font-bold text-text-primary mb-2">
          Add Toppings & Decorations
        </h3>
        <p className="text-text-muted text-sm mb-4">
          Select multiple decorations (optional)
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {toppings.map((topping) => {
            const isSelected = specifications.toppings.includes(topping.value);
            return (
              <button
                key={topping.value}
                onClick={() => toggleTopping(topping.value)}
                className={`text-left p-3 rounded-brand border-2 transition-all hover:shadow-md ${
                  isSelected
                    ? "border-brand-red bg-brand-red/5 shadow-sm"
                    : "border-brand-sage/30 hover:border-brand-red/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium">{topping.label}</span>
                  {isSelected && (
                    <span className="text-brand-red text-lg leading-none">&#10003;</span>
                  )}
                </div>
                <span className="text-xs text-text-muted">{topping.price}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
