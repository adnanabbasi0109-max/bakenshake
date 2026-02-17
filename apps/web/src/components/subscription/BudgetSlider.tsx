"use client";

interface BudgetRange {
  min: number;
  max: number;
}

interface BudgetSliderProps {
  min: number;
  max: number;
  value: BudgetRange;
  onChange: (min: number, max: number) => void;
}

export default function BudgetSlider({
  min,
  max,
  value,
  onChange,
}: BudgetSliderProps) {
  const formatCurrency = (amount: number) =>
    `₹${amount.toLocaleString("en-IN")}`;

  const handleMinChange = (newMin: number) => {
    const clamped = Math.min(Math.max(newMin, min), value.max);
    onChange(clamped, value.max);
  };

  const handleMaxChange = (newMax: number) => {
    const clamped = Math.max(Math.min(newMax, max), value.min);
    onChange(value.min, clamped);
  };

  return (
    <div className="space-y-4">
      {/* Display current range */}
      <div className="text-center">
        <span className="font-display text-lg font-bold text-brand-red">
          {formatCurrency(value.min)} - {formatCurrency(value.max)}
        </span>
        <p className="text-xs text-text-muted font-body mt-0.5">per week</p>
      </div>

      {/* Inputs */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-text-muted font-body mb-1">
            Min Budget
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
              ₹
            </span>
            <input
              type="number"
              min={min}
              max={value.max}
              step={50}
              value={value.min}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-2.5 rounded-brand border border-brand-sage/30 text-sm font-body text-text-primary focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/30 transition-colors"
            />
          </div>
        </div>

        <span className="text-text-muted font-body mt-5">to</span>

        <div className="flex-1">
          <label className="block text-xs font-medium text-text-muted font-body mb-1">
            Max Budget
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
              ₹
            </span>
            <input
              type="number"
              min={value.min}
              max={max}
              step={50}
              value={value.max}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="w-full pl-7 pr-3 py-2.5 rounded-brand border border-brand-sage/30 text-sm font-body text-text-primary focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red/30 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Range bar visualization */}
      <div className="relative h-2 bg-brand-sage/20 rounded-full">
        <div
          className="absolute h-full bg-brand-red rounded-full"
          style={{
            left: `${((value.min - min) / (max - min)) * 100}%`,
            right: `${100 - ((value.max - min) / (max - min)) * 100}%`,
          }}
        />
      </div>

      {/* Min / Max labels */}
      <div className="flex justify-between text-xs text-text-muted font-body">
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}</span>
      </div>
    </div>
  );
}
