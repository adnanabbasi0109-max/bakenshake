"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-brand-cream">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="zigzag" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 20 L10 0 L20 20 L30 0 L40 20" stroke="#A8384C" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#zigzag)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-brand-red font-semibold text-sm tracking-widest uppercase mb-4 block">
              Premium Bakery & Cafe
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6">
              Freshly Baked,{" "}
              <span className="text-brand-red">Delivered</span> With Love
            </h1>
            <p className="text-text-secondary text-lg mb-8 max-w-lg">
              From artisan cakes to flaky croissants, discover handcrafted
              bakery delights delivered fresh to your doorstep across Bhopal,
              Indore & Gwalior.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="/category/cakes" size="lg">Order Cakes</Button>
              <Button href="/custom-cake" variant="outline" size="lg">
                Build Custom Cake
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-8 text-text-muted text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                100% Eggless Options
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-red rounded-full" />
                7+ Outlets
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-lavender rounded-full" />
                Same Day Delivery
              </div>
            </div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-brand overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80"
                alt="Fresh bakery display with cakes and pastries"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-brand shadow-lg p-4 hidden md:block">
              <p className="font-display text-2xl font-bold text-brand-red">4.8</p>
              <div className="flex text-yellow-400 text-sm">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="text-xs text-text-muted mt-1">2000+ happy customers</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
