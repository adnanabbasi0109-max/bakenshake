"use client";

interface LaneTabsProps {
  selectedLane: string;
  onLaneChange: (lane: string) => void;
  showFreshTab?: boolean;
}

const LANES = [
  { value: "FRESH_CITY_ONLY", label: "Fresh Local" },
  { value: "SHELF_STABLE_NATIONAL", label: "Pan-India" },
];

export default function LaneTabs({
  selectedLane,
  onLaneChange,
  showFreshTab = true,
}: LaneTabsProps) {
  return (
    <div className="flex border-b border-brand-sage/30">
      {LANES.map((lane) => {
        const isActive = selectedLane === lane.value;
        const isDisabled = lane.value === "FRESH_CITY_ONLY" && !showFreshTab;

        return (
          <button
            key={lane.value}
            onClick={() => !isDisabled && onLaneChange(lane.value)}
            disabled={isDisabled}
            className={`
              relative px-6 py-3 text-sm font-semibold font-body transition-colors duration-200
              ${isActive ? "text-brand-red" : "text-text-muted hover:text-text-secondary"}
              ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {lane.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red rounded-t-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}
