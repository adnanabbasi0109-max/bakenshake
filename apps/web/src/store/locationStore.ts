"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type City = "Bhopal" | "Indore" | "Gwalior" | "pan-india";

interface LocationState {
  selectedCity: City | null;
  showLocationModal: boolean;
  setCity: (city: City) => void;
  openLocationModal: () => void;
  closeLocationModal: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      selectedCity: null,
      showLocationModal: true,
      setCity: (city) => set({ selectedCity: city, showLocationModal: false }),
      openLocationModal: () => set({ showLocationModal: true }),
      closeLocationModal: () => set({ showLocationModal: false }),
    }),
    {
      name: "bns-location",
    }
  )
);
