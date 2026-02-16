"use client";

import { type LucideIcon } from "lucide-react";

interface HealthGoal {
  value: string;
  label: string;
  icon: LucideIcon;
}

interface HealthGoalCardProps {
  goal: HealthGoal;
  isSelected: boolean;
  onClick: () => void;
}

export default function HealthGoalCard({
  goal,
  isSelected,
  onClick,
}: HealthGoalCardProps) {
  const Icon = goal.icon;

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center justify-center gap-2 p-4 rounded-brand border-2 transition-all duration-200
        cursor-pointer font-body text-center min-h-[100px]
        ${
          isSelected
            ? "border-brand-red bg-brand-red/5 shadow-sm"
            : "border-brand-sage/30 bg-white hover:border-brand-sage/60"
        }
      `}
    >
      <Icon
        size={24}
        className={`${isSelected ? "text-brand-red" : "text-text-muted"} transition-colors`}
      />
      <span
        className={`text-sm font-semibold leading-tight ${
          isSelected ? "text-brand-red" : "text-text-primary"
        }`}
      >
        {goal.label}
      </span>
    </button>
  );
}
