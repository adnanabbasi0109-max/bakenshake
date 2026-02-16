"use client";

import { Check } from "lucide-react";

interface Step {
  label: string;
}

interface ByoWizardStepsProps {
  currentStep: number;
  steps: Step[];
}

export default function ByoWizardSteps({ currentStep, steps }: ByoWizardStepsProps) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isUpcoming = index > currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div
            key={index}
            className={`flex items-center ${isLast ? "" : "flex-1"}`}
          >
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-body
                  transition-all duration-200
                  ${
                    isCompleted
                      ? "bg-brand-red text-white"
                      : isCurrent
                        ? "bg-brand-red text-white ring-4 ring-brand-red/20"
                        : "bg-gray-200 text-text-muted"
                  }
                `}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span
                className={`
                  mt-2 text-xs font-body font-medium text-center whitespace-nowrap
                  ${
                    isCurrent
                      ? "text-brand-red"
                      : isCompleted
                        ? "text-text-primary"
                        : "text-text-muted"
                  }
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {!isLast && (
              <div
                className={`
                  flex-1 h-0.5 mx-2 mt-[-1.25rem] transition-colors duration-200
                  ${isCompleted ? "bg-brand-red" : "bg-gray-200"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
