import HeroSection from "@/components/home/HeroSection";
import CategoryCards from "@/components/home/CategoryCards";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import SubscriptionCTA from "@/components/home/SubscriptionCTA";
import CakeBuilderCTA from "@/components/home/CakeBuilderCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryCards />
      <FeaturedProducts />
      <SubscriptionCTA />
      <CakeBuilderCTA />

      {/* App Download Banner */}
      <section className="py-10 md:py-14 bg-brand-cream">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-3">
            Get the Bake N&apos; Shake App
          </h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Order faster, track your delivery in real-time, and get exclusive
            app-only offers.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-black text-white px-6 py-3 rounded-brand flex items-center gap-2 cursor-pointer hover:bg-gray-800 transition-colors">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              App Store
            </div>
            <div className="bg-black text-white px-6 py-3 rounded-brand flex items-center gap-2 cursor-pointer hover:bg-gray-800 transition-colors">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 2.302-2.302 2.302L15.396 12l2.302-2.492zM5.864 2.658L16.8 8.991l-2.302 2.302L5.864 2.658z" />
              </svg>
              Play Store
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
