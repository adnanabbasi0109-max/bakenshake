"use client";

interface FrequencyOption {
  value: string;
  label: string;
  price: number;
}

interface FrequencySelectorProps {
  frequencies: FrequencyOption[];
  selected: string;
  onChange: (value: string) => void;
}

export default function FrequencySelector({
  frequencies,
  selected,
  onChange,
}: FrequencySelectorProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {frequencies.map((freq) => {
        const isSelected = selected === freq.value;

        return (
          <button
            key={freq.value}
            onClick={() => onChange(freq.value)}
            className={`
              relative flex flex-col items-center px-5 py-3 rounded-brand border-2 transition-all duration-200
              font-body cursor-pointer
              ${
                isSelected
                  ? "border-brand-red bg-brand-red/5 shadow-sm"
                  : "border-brand-sage/30 bg-white hover:border-brand-sage/60"
              }
            `}
          >
            {/* Hidden radio for accessibility */}
            <input
              type="radio"
              name="frequency"
              value={freq.value}
              checked={isSelected}
              onChange={() => onChange(freq.value)}
              className="sr-only"
            />
            <span
              className={`text-sm font-semibold ${
                isSelected ? "text-brand-red" : "text-text-primary"
              }`}
            >
              {freq.label}
            </span>
            <span
              className={`text-xs mt-1 ${
                isSelected ? "text-brand-red/80" : "text-text-muted"
              }`}
            >
              ₹{freq.price.toLocaleString("en-IN")}
            </span>
          </button>
        );
      })}
    </div>
  );
}
