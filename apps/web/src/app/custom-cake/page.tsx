"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Check,
  Ruler,
  IceCream,
  Paintbrush,
  Star,
  MessageCircle,
  Home,
  Cake,
} from "lucide-react";
import { useCakeBuilderStore } from "@/store/cakeBuilderStore";
import { useCartStore } from "@/store/cartStore";
import { customCakeAPI } from "@/lib/api";
import Button from "@/components/ui/Button";
import ShapeAndSizeStep from "@/components/cake-builder/ShapeAndSizeStep";
import FlavorAndFillingStep from "@/components/cake-builder/FlavorAndFillingStep";
import FrostingStep from "@/components/cake-builder/FrostingStep";
import DecorationsStep from "@/components/cake-builder/DecorationsStep";
import MessageStep from "@/components/cake-builder/MessageStep";
import PreviewPanel from "@/components/cake-builder/PreviewPanel";
import PriceCalculator from "@/components/cake-builder/PriceCalculator";

const steps = [
  { id: 0, label: "Shape & Size", icon: Ruler },
  { id: 1, label: "Flavor & Filling", icon: IceCream },
  { id: 2, label: "Frosting", icon: Paintbrush },
  { id: 3, label: "Decorations", icon: Star },
  { id: 4, label: "Message", icon: MessageCircle },
];

export default function CustomCakePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { specifications, previewImageUrl, pricing, reset } =
    useCakeBuilderStore();
  const addItem = useCartStore((s) => s.addItem);

  const goNext = () => setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  const goPrev = () => setCurrentStep((s) => Math.max(s - 1, 0));
  const goTo = (step: number) => setCurrentStep(step);

  const handleAddToCart = async () => {
    setIsSubmitting(true);
    try {
      const res = await customCakeAPI.create({
        specifications: specifications as unknown as Record<string, unknown>,
        aiPreviewImageUrl: previewImageUrl || undefined,
        customerNotes: undefined,
      });

      const data = res as { success: boolean; data?: { _id: string } };
      if (data.success && data.data) {
        const orderId = data.data._id;
        const cakeName = `Custom ${specifications.flavor} Cake (${specifications.shape})`;

        addItem({
          productId: orderId,
          variantId: `custom-${orderId}`,
          name: cakeName,
          image: previewImageUrl || "https://images.unsplash.com/photo-1557979619-445218f326b9?w=400&q=80",
          size: specifications.size,
          price: pricing?.total || 0,
        });

        reset();
      }
    } catch {
      // Silently handle — user can retry
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream/30">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-sage/10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="flex items-center gap-1 hover:text-brand-red transition-colors">
              <Home size={14} />
              Home
            </Link>
            <span>/</span>
            <span className="flex items-center gap-1 text-brand-red font-medium">
              <Cake size={14} />
              Custom Cake Builder
            </span>
          </nav>
        </div>
      </div>

      {/* Sticky Step Header — offset below main header */}
      <div className="bg-white border-b border-brand-sage/20 sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-xl md:text-2xl font-bold text-text-primary">
              Design Your Dream Cake
            </h1>
            {pricing && (
              <span className="text-lg font-bold text-brand-red">
                ₹{pricing.total}
              </span>
            )}
          </div>

          {/* Step Indicators */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = i === currentStep;
              const isCompleted = i < currentStep;
              return (
                <button
                  key={step.id}
                  onClick={() => goTo(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-brand-red text-white"
                      : isCompleted
                        ? "bg-brand-red/10 text-brand-red"
                        : "bg-brand-sage/10 text-text-muted hover:bg-brand-sage/20"
                  }`}
                >
                  {isCompleted ? (
                    <Check size={14} />
                  ) : (
                    <Icon size={14} />
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Step Content — takes 2 cols on desktop */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-brand border border-brand-sage/20 p-6 min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {currentStep === 0 && <ShapeAndSizeStep />}
                  {currentStep === 1 && <FlavorAndFillingStep />}
                  {currentStep === 2 && <FrostingStep />}
                  {currentStep === 3 && <DecorationsStep />}
                  {currentStep === 4 && <MessageStep />}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-brand-sage/20">
                <Button
                  variant="outline"
                  onClick={goPrev}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Back
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button onClick={goNext}>
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={isSubmitting}
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    {isSubmitting ? "Adding..." : "Pay"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar — Preview + Price */}
          <div className="space-y-4">
            <PreviewPanel />
            <PriceCalculator />
          </div>
        </div>
      </div>
    </div>
  );
}
