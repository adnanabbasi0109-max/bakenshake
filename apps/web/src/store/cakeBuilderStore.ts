"use client";
import { create } from "zustand";

export type CakeShape = "round" | "square" | "heart" | "rectangle" | "tiered-2" | "tiered-3";
export type CakeSize = "0.5 kg" | "1 kg" | "1.5 kg" | "2 kg" | "3 kg" | "5 kg";
export type CakeFlavor = "vanilla" | "chocolate" | "red-velvet" | "butterscotch" | "black-forest" | "pineapple" | "mango" | "strawberry" | "coffee-mocha" | "fruit";
export type FrostingType = "buttercream" | "fondant" | "whipped-cream" | "ganache" | "cream-cheese";
export type CakeFilling = "none" | "chocolate-ganache" | "fruit-compote" | "caramel" | "nutella" | "cream" | "jam";
export type CakeTopping = "fresh-fruits" | "chocolate-shavings" | "sprinkles" | "edible-flowers" | "nuts" | "macarons" | "fondant-figures" | "gold-silver-leaf";
export type CakeTheme = "birthday" | "wedding" | "anniversary" | "baby-shower" | "graduation" | "valentine" | "christmas" | "diwali" | "generic-celebration";
export type EggPreference = "egg" | "eggless";

export interface CakeSpecifications {
  shape: CakeShape;
  size: CakeSize;
  flavor: CakeFlavor;
  frostingType: FrostingType;
  frostingColor: string;
  filling: CakeFilling;
  toppings: CakeTopping[];
  theme: CakeTheme;
  message: string;
  eggPreference: EggPreference;
  photoUploadUrl?: string;
}

export interface CakePricing {
  basePrice: number;
  flavorMultiplier: number;
  frostingMultiplier: number;
  shapeSurcharge: number;
  fillingPrice: number;
  toppingsTotal: number;
  photoSurcharge: number;
  total: number;
}

interface CakeBuilderState {
  currentStep: number;
  specifications: CakeSpecifications;
  pricing: CakePricing | null;
  previewImageUrl: string | null;
  isGenerating: boolean;
  generationCount: number;
  error: string | null;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateSpec: <K extends keyof CakeSpecifications>(key: K, value: CakeSpecifications[K]) => void;
  toggleTopping: (topping: CakeTopping) => void;
  setPricing: (pricing: CakePricing) => void;
  setPreviewImage: (url: string) => void;
  setIsGenerating: (val: boolean) => void;
  incrementGeneration: () => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const defaultSpecs: CakeSpecifications = {
  shape: "round",
  size: "1 kg",
  flavor: "chocolate",
  frostingType: "buttercream",
  frostingColor: "#FFFFFF",
  filling: "none",
  toppings: [],
  theme: "birthday",
  message: "",
  eggPreference: "eggless",
};

export const useCakeBuilderStore = create<CakeBuilderState>()((set, get) => ({
  currentStep: 0,
  specifications: { ...defaultSpecs },
  pricing: null,
  previewImageUrl: null,
  isGenerating: false,
  generationCount: 0,
  error: null,

  setStep: (step) => set({ currentStep: step }),
  nextStep: () => set((s) => ({ currentStep: Math.min(s.currentStep + 1, 4) })),
  prevStep: () => set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

  updateSpec: (key, value) =>
    set((s) => ({
      specifications: { ...s.specifications, [key]: value },
      previewImageUrl: null, // Reset preview when specs change
    })),

  toggleTopping: (topping) =>
    set((s) => {
      const toppings = s.specifications.toppings.includes(topping)
        ? s.specifications.toppings.filter((t) => t !== topping)
        : [...s.specifications.toppings, topping];
      return {
        specifications: { ...s.specifications, toppings },
        previewImageUrl: null,
      };
    }),

  setPricing: (pricing) => set({ pricing }),
  setPreviewImage: (url) => set({ previewImageUrl: url }),
  setIsGenerating: (val) => set({ isGenerating: val }),
  incrementGeneration: () => set((s) => ({ generationCount: s.generationCount + 1 })),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      currentStep: 0,
      specifications: { ...defaultSpecs },
      pricing: null,
      previewImageUrl: null,
      isGenerating: false,
      generationCount: 0,
      error: null,
    }),
}));
