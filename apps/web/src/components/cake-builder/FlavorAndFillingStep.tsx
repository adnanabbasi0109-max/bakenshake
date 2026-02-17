"use client";
import { useCakeBuilderStore, CakeFlavor, CakeFilling } from "@/store/cakeBuilderStore";

const flavors: { value: CakeFlavor; label: string; color: string }[] = [
  { value: "vanilla", label: "Vanilla", color: "bg-yellow-100" },
  { value: "chocolate", label: "Chocolate", color: "bg-amber-800" },
  { value: "red-velvet", label: "Red Velvet", color: "bg-red-700" },
  { value: "butterscotch", label: "Butterscotch", color: "bg-amber-400" },
  { value: "black-forest", label: "Black Forest", color: "bg-stone-800" },
  { value: "pineapple", label: "Pineapple", color: "bg-yellow-300" },
  { value: "mango", label: "Mango", color: "bg-orange-400" },
  { value: "strawberry", label: "Strawberry", color: "bg-pink-400" },
  { value: "coffee-mocha", label: "Coffee Mocha", color: "bg-amber-900" },
  { value: "fruit", label: "Mixed Fruit", color: "bg-orange-300" },
];

const fillings: { value: CakeFilling; label: string }[] = [
  { value: "none", label: "No Filling" },
  { value: "chocolate-ganache", label: "Chocolate Ganache" },
  { value: "fruit-compote", label: "Fruit Compote" },
  { value: "caramel", label: "Caramel" },
  { value: "nutella", label: "Nutella" },
  { value: "cream", label: "Fresh Cream" },
  { value: "jam", label: "Jam" },
];

export default function FlavorAndFillingStep() {
  const { specifications, updateSpec } = useCakeBuilderStore();

  return (
    <div className="space-y-8">
      {/* Flavor */}
      <div>
        <h3 className="font-display text-xl font-bold text-text-primary mb-2">
          Pick Your Flavour
        </h3>
        <p className="text-text-muted text-sm mb-4">Choose the base flavour for your cake</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {flavors.map((flavor) => (
            <button
              key={flavor.value}
              onClick={() => updateSpec("flavor", flavor.value)}
              className={`flex items-center gap-3 p-3 rounded-brand border-2 transition-all hover:shadow-md ${
                specifications.flavor === flavor.value
                  ? "border-brand-red bg-brand-red/5 shadow-sm"
                  : "border-brand-sage/30 hover:border-brand-red/50"
              }`}
            >
              <span
                className={`w-8 h-8 rounded-full ${flavor.color} flex-shrink-0 border border-white/50`}
              />
              <span className="text-sm font-medium">{flavor.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filling */}
      <div>
        <h3 className="font-display text-xl font-bold text-text-primary mb-2">
          Choose a Filling
        </h3>
        <p className="text-text-muted text-sm mb-4">Add a delicious filling between layers</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fillings.map((filling) => (
            <button
              key={filling.value}
              onClick={() => updateSpec("filling", filling.value)}
              className={`p-3 rounded-brand border-2 text-sm font-medium transition-all hover:shadow-md ${
                specifications.filling === filling.value
                  ? "border-brand-red bg-brand-red/5 shadow-sm"
                  : "border-brand-sage/30 hover:border-brand-red/50"
              }`}
            >
              {filling.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
