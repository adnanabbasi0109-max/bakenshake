"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Dumbbell,
  Heart,
  Ban,
  Wheat,
  ArrowLeft,
  ArrowRight,
  Check,
} from "lucide-react";
import Button from "@/components/ui/Button";
import HealthGoalCard from "@/components/subscription/HealthGoalCard";
import FrequencySelector from "@/components/subscription/FrequencySelector";
import BasketPreview from "@/components/subscription/BasketPreview";
import PriceSummary from "@/components/subscription/PriceSummary";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STEPS = [
  { label: "Health Goal" },
  { label: "Exclusions" },
  { label: "Frequency" },
  { label: "Basket" },
  { label: "Delivery" },
];

const HEALTH_GOALS = [
  { value: "weight_loss", label: "Weight Loss", icon: Target },
  { value: "muscle_gain", label: "Muscle Gain", icon: Dumbbell },
  { value: "general_health", label: "General Health", icon: Heart },
  { value: "low_sugar_diet", label: "Low Sugar Diet", icon: Ban },
  { value: "high_fiber_diet", label: "High Fiber Diet", icon: Wheat },
];

const EXCLUSION_OPTIONS = [
  "contains-egg",
  "non-veg",
  "gluten",
  "dairy",
  "nuts",
];

const FREQUENCIES = [
  { value: "weekly", label: "Weekly", price: 399 },
  { value: "biweekly", label: "Biweekly", price: 699 },
  { value: "monthly", label: "Monthly", price: 1199 },
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_SLOTS = [
  { value: "morning", label: "Morning 8-11" },
  { value: "afternoon", label: "Afternoon 12-3" },
  { value: "evening", label: "Evening 4-7" },
];

const PROTEIN_ITEMS = [
  {
    productId: "b1",
    name: "Whey Protein Muffin (2pc)",
    image:
      "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200&q=80",
    quantity: 1,
    price: 180,
  },
  {
    productId: "b2",
    name: "Peanut Butter Cookie (4pc)",
    image:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&q=80",
    quantity: 1,
    price: 160,
  },
  {
    productId: "b3",
    name: "Almond Energy Bar (3pc)",
    image:
      "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=200&q=80",
    quantity: 1,
    price: 120,
  },
];

const GENERAL_ITEMS = [
  {
    productId: "b4",
    name: "Multigrain Bread Loaf",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80",
    quantity: 1,
    price: 150,
  },
  {
    productId: "b5",
    name: "Oats & Raisin Cookie (4pc)",
    image:
      "https://images.unsplash.com/photo-1497051788611-2c64812349fa?w=200&q=80",
    quantity: 1,
    price: 100,
  },
  {
    productId: "b6",
    name: "Banana Walnut Muffin (2pc)",
    image:
      "https://images.unsplash.com/photo-1565073628218-165c385bfcc6?w=200&q=80",
    quantity: 1,
    price: 140,
  },
];

/* ------------------------------------------------------------------ */
/*  Step indicator (reuses ByoWizardSteps inline for self-contained)   */
/* ------------------------------------------------------------------ */

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center w-full">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === STEPS.length - 1;

        return (
          <div
            key={index}
            className={`flex items-center ${isLast ? "" : "flex-1"}`}
          >
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

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const stepVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 80 : -80,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -80 : 80,
    transition: { duration: 0.25, ease: "easeIn" as const },
  }),
};

/* ------------------------------------------------------------------ */
/*  Main wizard page                                                   */
/* ------------------------------------------------------------------ */

export default function BuildYourOwnPage() {
  /* ---- wizard state ---- */
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  /* ---- step 0: health goal ---- */
  const [selectedGoal, setSelectedGoal] = useState("");

  /* ---- step 1: exclusions ---- */
  const [exclusions, setExclusions] = useState<string[]>([]);

  /* ---- step 2: frequency & budget ---- */
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [budgetMin, setBudgetMin] = useState(300);
  const [budgetMax, setBudgetMax] = useState(1000);

  /* ---- step 3: basket (derived) ---- */
  const suggestedItems =
    selectedGoal === "muscle_gain" || selectedGoal === "weight_loss"
      ? PROTEIN_ITEMS
      : GENERAL_ITEMS;

  const subtotal = suggestedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discountAmount = Math.round(subtotal * 0.1);
  const afterDiscount = subtotal - discountAmount;
  const deliveryCharge = afterDiscount >= 499 ? 0 : 49;
  const taxAmount = Math.round(afterDiscount * 0.05);
  const totalAmount = afterDiscount + deliveryCharge + taxAmount;

  /* ---- step 4: delivery ---- */
  const [deliveryDay, setDeliveryDay] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  /* ---- navigation helpers ---- */
  const isNextDisabled = (): boolean => {
    switch (currentStep) {
      case 0:
        return !selectedGoal;
      case 1:
        return false; // exclusions are optional
      case 2:
        return !selectedFrequency;
      case 3:
        return false; // review step, always can proceed
      case 4:
        return !deliveryDay || !timeSlot;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const toggleExclusion = (item: string) => {
    setExclusions((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item],
    );
  };

  const handleSubscribe = () => {
    alert(
      "Subscription confirmed! (Demo)\n\n" +
        `Goal: ${selectedGoal}\n` +
        `Exclusions: ${exclusions.join(", ") || "None"}\n` +
        `Frequency: ${selectedFrequency}\n` +
        `Budget: ₹${budgetMin} - ₹${budgetMax}\n` +
        `Delivery: ${deliveryDay}, ${timeSlot}\n` +
        `Total: ₹${totalAmount}`,
    );
  };

  /* ---- step content renderers ---- */

  const renderStep = () => {
    switch (currentStep) {
      /* ============================================================ */
      /*  Step 0: Health Goal Selection                                */
      /* ============================================================ */
      case 0:
        return (
          <div>
            <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
              What&apos;s your health goal?
            </h2>
            <p className="mt-2 text-text-muted font-body">
              Pick the goal that best describes what you&apos;re working towards.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {HEALTH_GOALS.map((goal) => (
                <HealthGoalCard
                  key={goal.value}
                  goal={goal}
                  isSelected={selectedGoal === goal.value}
                  onClick={() => setSelectedGoal(goal.value)}
                />
              ))}
            </div>
          </div>
        );

      /* ============================================================ */
      /*  Step 1: Dietary Exclusions                                   */
      /* ============================================================ */
      case 1:
        return (
          <div>
            <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
              Any dietary exclusions?
            </h2>
            <p className="mt-2 text-text-muted font-body">
              Select items you want to exclude from your box. Skip this step if
              you have no restrictions.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {EXCLUSION_OPTIONS.map((item) => {
                const isActive = exclusions.includes(item);
                return (
                  <button
                    key={item}
                    onClick={() => toggleExclusion(item)}
                    className={`
                      px-5 py-2.5 rounded-full border-2 text-sm font-semibold font-body
                      transition-all duration-200 cursor-pointer capitalize
                      ${
                        isActive
                          ? "border-brand-red bg-brand-red/10 text-brand-red"
                          : "border-brand-sage/30 bg-white text-text-secondary hover:border-brand-sage/60"
                      }
                    `}
                  >
                    {item.replace("-", " ")}
                  </button>
                );
              })}
            </div>
          </div>
        );

      /* ============================================================ */
      /*  Step 2: Frequency & Budget                                   */
      /* ============================================================ */
      case 2:
        return (
          <div>
            <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
              How often &amp; your budget?
            </h2>
            <p className="mt-2 text-text-muted font-body">
              Choose a delivery frequency and set your budget range.
            </p>

            {/* Frequency selector */}
            <div className="mt-8">
              <h3 className="font-display text-lg font-bold text-text-primary mb-3">
                Delivery Frequency
              </h3>
              <FrequencySelector
                frequencies={FREQUENCIES}
                selected={selectedFrequency}
                onChange={setSelectedFrequency}
              />
            </div>

            {/* Budget range */}
            <div className="mt-8">
              <h3 className="font-display text-lg font-bold text-text-primary mb-3">
                Budget Range
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-body text-text-muted">
                    Min (₹)
                  </label>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    min={0}
                    className="w-28 rounded-brand border-2 border-brand-sage/30 px-3 py-2 text-sm font-body
                      text-text-primary focus:border-brand-red focus:outline-none transition-colors"
                  />
                </div>
                <span className="mt-5 text-text-muted font-body">&mdash;</span>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-body text-text-muted">
                    Max (₹)
                  </label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    min={0}
                    className="w-28 rounded-brand border-2 border-brand-sage/30 px-3 py-2 text-sm font-body
                      text-text-primary focus:border-brand-red focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      /* ============================================================ */
      /*  Step 3: Review Suggested Basket                              */
      /* ============================================================ */
      case 3:
        return (
          <div>
            <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
              Your Suggested Basket
            </h2>
            <p className="mt-2 text-text-muted font-body">
              Based on your goal, here&apos;s what we recommend. You can swap
              items after subscribing.
            </p>

            <div className="mt-8 space-y-6">
              <BasketPreview
                items={suggestedItems}
                title="Recommended Items"
              />

              <PriceSummary
                subtotal={subtotal}
                discountAmount={discountAmount}
                deliveryCharge={deliveryCharge}
                taxAmount={taxAmount}
                totalAmount={totalAmount}
                discountLabel="Subscription Discount (10%)"
              />
            </div>
          </div>
        );

      /* ============================================================ */
      /*  Step 4: Delivery & Confirm                                   */
      /* ============================================================ */
      case 4:
        return (
          <div>
            <h2 className="font-display text-2xl font-bold text-text-primary sm:text-3xl">
              Delivery Preferences
            </h2>
            <p className="mt-2 text-text-muted font-body">
              Pick your preferred delivery day and time slot.
            </p>

            {/* Day selector */}
            <div className="mt-8">
              <h3 className="font-display text-lg font-bold text-text-primary mb-3">
                Preferred Day
              </h3>
              <div className="flex flex-wrap gap-2">
                {DAYS.map((day) => {
                  const isActive = deliveryDay === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setDeliveryDay(day)}
                      className={`
                        w-14 py-2.5 rounded-brand border-2 text-sm font-semibold font-body
                        transition-all duration-200 cursor-pointer
                        ${
                          isActive
                            ? "border-brand-red bg-brand-red text-white"
                            : "border-brand-sage/30 bg-white text-text-secondary hover:border-brand-sage/60"
                        }
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time slot selector */}
            <div className="mt-8">
              <h3 className="font-display text-lg font-bold text-text-primary mb-3">
                Time Slot
              </h3>
              <div className="flex flex-wrap gap-3">
                {TIME_SLOTS.map((slot) => {
                  const isActive = timeSlot === slot.value;
                  return (
                    <button
                      key={slot.value}
                      onClick={() => setTimeSlot(slot.value)}
                      className={`
                        px-5 py-2.5 rounded-brand border-2 text-sm font-semibold font-body
                        transition-all duration-200 cursor-pointer
                        ${
                          isActive
                            ? "border-brand-red bg-brand-red text-white"
                            : "border-brand-sage/30 bg-white text-text-secondary hover:border-brand-sage/60"
                        }
                      `}
                    >
                      {slot.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subscribe button */}
            <div className="mt-10">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleSubscribe}
                disabled={!deliveryDay || !timeSlot}
              >
                <Check size={18} className="mr-2" />
                Subscribe Now
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-cream/40 to-white">
      {/* Header */}
      <div className="bg-brand-cream">
        <div className="mx-auto max-w-4xl px-6 py-10 text-center">
          <h1 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
            Build Your Own Box
          </h1>
          <p className="mt-2 text-text-muted font-body">
            Customize a subscription box tailored to your goals.
          </p>
        </div>
      </div>

      {/* Wizard container */}
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Step indicator */}
        <div className="mb-10">
          <StepIndicator currentStep={currentStep} />
        </div>

        {/* Step content with framer-motion transition */}
        <div className="relative overflow-hidden">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {renderStep()}
          </motion.div>
        </div>

        {/* Navigation buttons */}
        <div className="mt-10 flex items-center justify-between border-t border-brand-sage/20 pt-6">
          <Button
            variant="ghost"
            size="md"
            onClick={goBack}
            disabled={currentStep === 0}
            className={currentStep === 0 ? "invisible" : ""}
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>

          {currentStep < STEPS.length - 1 && (
            <Button
              variant="primary"
              size="md"
              onClick={goNext}
              disabled={isNextDisabled()}
            >
              Next
              <ArrowRight size={16} className="ml-2" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
