"use client";
import { useLocationStore } from "@/store/locationStore";
import Modal from "@/components/ui/Modal";
import { MapPin } from "lucide-react";

const cities = [
  { id: "Bhopal" as const, name: "Bhopal", desc: "Full menu + fresh delivery" },
  { id: "Indore" as const, name: "Indore", desc: "Full menu + fresh delivery" },
  { id: "Gwalior" as const, name: "Gwalior", desc: "Full menu + fresh delivery" },
  { id: "pan-india" as const, name: "Ship Pan-India", desc: "Cookies, hampers & shelf-stable items" },
];

export default function LocationModal() {
  const { showLocationModal, closeLocationModal, setCity, selectedCity } = useLocationStore();

  // Don't show if already selected
  if (selectedCity && !showLocationModal) return null;

  return (
    <Modal
      isOpen={showLocationModal || !selectedCity}
      onClose={() => {
        if (selectedCity) closeLocationModal();
      }}
      showClose={!!selectedCity}
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-brand-cream rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin size={28} className="text-brand-red" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold text-brand-red mb-2">
          Where should we deliver?
        </h2>
        <p className="text-text-secondary text-sm">
          Select your city for the best experience and fresh product availability
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cities.map((city) => (
          <button
            key={city.id}
            onClick={() => setCity(city.id)}
            className={`p-4 rounded-brand border-2 text-left transition-all hover:shadow-md ${
              selectedCity === city.id
                ? "border-brand-red bg-brand-red/5"
                : "border-brand-sage/30 hover:border-brand-red/50"
            }`}
          >
            <p className="font-semibold text-text-primary">{city.name}</p>
            <p className="text-xs text-text-muted mt-1">{city.desc}</p>
          </button>
        ))}
      </div>
    </Modal>
  );
}
