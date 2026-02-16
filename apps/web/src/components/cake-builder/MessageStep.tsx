"use client";
import { useCakeBuilderStore } from "@/store/cakeBuilderStore";

export default function MessageStep() {
  const { specifications, updateSpec } = useCakeBuilderStore();

  return (
    <div className="space-y-8">
      {/* Message on Cake */}
      <div>
        <h3 className="font-display text-xl font-bold text-text-primary mb-2">
          Message on Cake
        </h3>
        <p className="text-text-muted text-sm mb-4">
          Add a personal message (optional, max 50 characters)
        </p>
        <div className="relative">
          <input
            type="text"
            value={specifications.message}
            onChange={(e) => {
              if (e.target.value.length <= 50) {
                updateSpec("message", e.target.value);
              }
            }}
            placeholder="e.g., Happy Birthday, Priya!"
            className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sage/30 rounded-brand text-base focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted">
            {specifications.message.length}/50
          </span>
        </div>
        {specifications.message && (
          <div className="mt-4 p-4 bg-brand-cream/30 rounded-brand">
            <p className="text-xs text-text-muted mb-1">Preview on cake:</p>
            <p className="font-display text-xl text-brand-red italic text-center">
              &ldquo;{specifications.message}&rdquo;
            </p>
          </div>
        )}
      </div>

      {/* Special Instructions */}
      <div>
        <h3 className="font-display text-xl font-bold text-text-primary mb-2">
          Special Instructions
        </h3>
        <p className="text-text-muted text-sm mb-4">
          Any additional notes for our bakers? (dietary requirements, allergies, etc.)
        </p>
        <textarea
          rows={3}
          placeholder="e.g., Please avoid nuts, make it extra moist..."
          className="w-full px-4 py-3 bg-brand-cream/50 border border-brand-sage/30 rounded-brand text-sm focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/20 resize-none"
        />
      </div>

      {/* Summary */}
      <div className="bg-brand-sage-light/40 rounded-brand p-5">
        <h3 className="font-display text-lg font-bold text-text-primary mb-3">
          Your Cake Summary
        </h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="text-text-muted">Shape:</span>
          <span className="font-medium capitalize">{specifications.shape.replace(/-/g, " ")}</span>
          <span className="text-text-muted">Size:</span>
          <span className="font-medium">{specifications.size}</span>
          <span className="text-text-muted">Flavour:</span>
          <span className="font-medium capitalize">{specifications.flavor.replace(/-/g, " ")}</span>
          <span className="text-text-muted">Frosting:</span>
          <span className="font-medium capitalize">{specifications.frostingType.replace(/-/g, " ")}</span>
          <span className="text-text-muted">Colour:</span>
          <span className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full border border-gray-300 inline-block"
              style={{ backgroundColor: specifications.frostingColor }}
            />
            {specifications.frostingColor}
          </span>
          <span className="text-text-muted">Filling:</span>
          <span className="font-medium capitalize">{specifications.filling.replace(/-/g, " ")}</span>
          <span className="text-text-muted">Theme:</span>
          <span className="font-medium capitalize">{specifications.theme.replace(/-/g, " ")}</span>
          <span className="text-text-muted">Egg:</span>
          <span className="font-medium capitalize">{specifications.eggPreference}</span>
          {specifications.toppings.length > 0 && (
            <>
              <span className="text-text-muted">Toppings:</span>
              <span className="font-medium capitalize">
                {specifications.toppings.map((t) => t.replace(/-/g, " ")).join(", ")}
              </span>
            </>
          )}
          {specifications.message && (
            <>
              <span className="text-text-muted">Message:</span>
              <span className="font-medium">&ldquo;{specifications.message}&rdquo;</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
