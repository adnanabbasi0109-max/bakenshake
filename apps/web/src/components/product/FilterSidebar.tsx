"use client";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import Button from "@/components/ui/Button";

const dietaryFilters = [
  { value: "veg", label: "Vegetarian", dot: "bg-green-500" },
  { value: "eggless", label: "Eggless", dot: "bg-green-500" },
  { value: "contains-egg", label: "Contains Egg", dot: "bg-red-500" },
  { value: "non-veg", label: "Non-Veg", dot: "bg-red-500" },
];

const priceRanges = [
  { label: "Under ₹200", min: 0, max: 200 },
  { label: "₹200 - ₹500", min: 200, max: 500 },
  { label: "₹500 - ₹1000", min: 500, max: 1000 },
  { label: "Above ₹1000", min: 1000, max: 99999 },
];

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
  { value: "rating", label: "Highest Rated" },
];

interface FilterSidebarProps {
  selectedDietary: string[];
  selectedPriceRange: { min: number; max: number } | null;
  selectedSort: string;
  onDietaryChange: (dietary: string[]) => void;
  onPriceRangeChange: (range: { min: number; max: number } | null) => void;
  onSortChange: (sort: string) => void;
  onClear: () => void;
}

export default function FilterSidebar({
  selectedDietary,
  selectedPriceRange,
  selectedSort,
  onDietaryChange,
  onPriceRangeChange,
  onSortChange,
  onClear,
}: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasFilters = selectedDietary.length > 0 || selectedPriceRange || selectedSort !== "relevance";

  const toggleDietary = (value: string) => {
    if (selectedDietary.includes(value)) {
      onDietaryChange(selectedDietary.filter((d) => d !== value));
    } else {
      onDietaryChange([...selectedDietary, value]);
    }
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="font-semibold text-text-primary mb-3">Sort By</h3>
        <div className="space-y-2">
          {sortOptions.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sort"
                checked={selectedSort === opt.value}
                onChange={() => onSortChange(opt.value)}
                className="accent-brand-red"
              />
              <span className="text-sm text-text-secondary">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dietary */}
      <div>
        <h3 className="font-semibold text-text-primary mb-3">Dietary Preference</h3>
        <div className="space-y-2">
          {dietaryFilters.map((filter) => (
            <label key={filter.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedDietary.includes(filter.value)}
                onChange={() => toggleDietary(filter.value)}
                className="accent-brand-red"
              />
              <span className={`w-2 h-2 rounded-full ${filter.dot}`} />
              <span className="text-sm text-text-secondary">{filter.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-text-primary mb-3">Price Range</h3>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={
                  selectedPriceRange?.min === range.min &&
                  selectedPriceRange?.max === range.max
                }
                onChange={() => onPriceRangeChange(range)}
                className="accent-brand-red"
              />
              <span className="text-sm text-text-secondary">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear */}
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} fullWidth>
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-brand-cream rounded-brand text-sm font-medium"
      >
        <SlidersHorizontal size={16} />
        Filters
        {hasFilters && (
          <span className="bg-brand-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            !
          </span>
        )}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24 bg-white p-6 rounded-brand border border-brand-sage/20">
          <h2 className="font-display text-lg font-bold text-text-primary mb-4">Filters</h2>
          {filterContent}
        </div>
      </aside>

      {/* Mobile bottom sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-display text-lg font-bold">Filters</h2>
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <X size={20} />
              </button>
            </div>
            <div className="p-4">{filterContent}</div>
            <div className="p-4 border-t">
              <Button fullWidth onClick={() => setMobileOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
