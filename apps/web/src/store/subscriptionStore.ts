"use client";
import { create } from "zustand";

type Lane = "FRESH_CITY_ONLY" | "SHELF_STABLE_NATIONAL";
type Frequency = "weekly" | "biweekly" | "monthly";

interface ByoItem {
  productId: string;
  variantIndex: number;
  quantity: number;
  name: string;
  image: string;
  price: number;
}

interface SubscriptionState {
  // Landing page
  selectedLane: Lane;
  setSelectedLane: (lane: Lane) => void;

  // Build-your-own wizard
  byoStep: number;
  byoHealthGoal: string | null;
  byoExclusions: string[];
  byoFrequency: Frequency;
  byoBudgetMin: number;
  byoBudgetMax: number;
  byoSuggestedItems: ByoItem[];
  byoEditedItems: ByoItem[];
  setByoStep: (step: number) => void;
  nextByoStep: () => void;
  prevByoStep: () => void;
  setByoHealthGoal: (goal: string) => void;
  toggleByoExclusion: (exclusion: string) => void;
  setByoFrequency: (freq: Frequency) => void;
  setByoBudget: (min: number, max: number) => void;
  setByoSuggestedItems: (items: ByoItem[]) => void;
  setByoEditedItems: (items: ByoItem[]) => void;
  addByoItem: (item: ByoItem) => void;
  removeByoItem: (productId: string) => void;

  // Subscribe & Save (single product)
  subscribeProductId: string | null;
  subscribeVariantIndex: number;
  subscribeFrequency: Frequency;
  subscribeQuantity: number;
  setSubscribeProduct: (productId: string, variantIndex: number) => void;
  setSubscribeFrequency: (freq: Frequency) => void;
  setSubscribeQuantity: (qty: number) => void;
  clearSubscribeProduct: () => void;

  // Active subscription management
  activeSubscriptionId: string | null;
  setActiveSubscriptionId: (id: string | null) => void;

  reset: () => void;
  resetByo: () => void;
}

const initialByoState = {
  byoStep: 0,
  byoHealthGoal: null as string | null,
  byoExclusions: [] as string[],
  byoFrequency: "weekly" as Frequency,
  byoBudgetMin: 300,
  byoBudgetMax: 1000,
  byoSuggestedItems: [] as ByoItem[],
  byoEditedItems: [] as ByoItem[],
};

export const useSubscriptionStore = create<SubscriptionState>()((set, get) => ({
  selectedLane: "FRESH_CITY_ONLY",
  ...initialByoState,
  subscribeProductId: null,
  subscribeVariantIndex: 0,
  subscribeFrequency: "monthly",
  subscribeQuantity: 1,
  activeSubscriptionId: null,

  setSelectedLane: (lane) => set({ selectedLane: lane }),

  // BYO wizard
  setByoStep: (step) => set({ byoStep: step }),
  nextByoStep: () => set({ byoStep: get().byoStep + 1 }),
  prevByoStep: () => set({ byoStep: Math.max(0, get().byoStep - 1) }),
  setByoHealthGoal: (goal) => set({ byoHealthGoal: goal }),
  toggleByoExclusion: (exclusion) => {
    const current = get().byoExclusions;
    set({
      byoExclusions: current.includes(exclusion)
        ? current.filter((e) => e !== exclusion)
        : [...current, exclusion],
    });
  },
  setByoFrequency: (freq) => set({ byoFrequency: freq }),
  setByoBudget: (min, max) => set({ byoBudgetMin: min, byoBudgetMax: max }),
  setByoSuggestedItems: (items) =>
    set({ byoSuggestedItems: items, byoEditedItems: items }),
  setByoEditedItems: (items) => set({ byoEditedItems: items }),
  addByoItem: (item) =>
    set({ byoEditedItems: [...get().byoEditedItems, item] }),
  removeByoItem: (productId) =>
    set({
      byoEditedItems: get().byoEditedItems.filter(
        (i) => i.productId !== productId
      ),
    }),

  // Subscribe & Save
  setSubscribeProduct: (productId, variantIndex) =>
    set({ subscribeProductId: productId, subscribeVariantIndex: variantIndex }),
  setSubscribeFrequency: (freq) => set({ subscribeFrequency: freq }),
  setSubscribeQuantity: (qty) => set({ subscribeQuantity: Math.max(1, qty) }),
  clearSubscribeProduct: () =>
    set({
      subscribeProductId: null,
      subscribeVariantIndex: 0,
      subscribeFrequency: "monthly",
      subscribeQuantity: 1,
    }),

  // Management
  setActiveSubscriptionId: (id) => set({ activeSubscriptionId: id }),

  reset: () =>
    set({
      selectedLane: "FRESH_CITY_ONLY",
      ...initialByoState,
      subscribeProductId: null,
      subscribeVariantIndex: 0,
      subscribeFrequency: "monthly",
      subscribeQuantity: 1,
      activeSubscriptionId: null,
    }),
  resetByo: () => set(initialByoState),
}));
