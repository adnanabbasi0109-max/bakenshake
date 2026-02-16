"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function CakeBuilderCTA() {
  return (
    <section className="py-10 md:py-14">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative bg-brand-lavender rounded-brand overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circles" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <circle cx="30" cy="30" r="20" fill="none" stroke="#A8384C" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circles)" />
            </svg>
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 md:p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                Design Your Dream Cake
              </h2>
              <p className="text-white/80 mb-6 max-w-md">
                Choose your shape, flavour, frosting, and decorations — then
                preview your custom cake before ordering.
              </p>
              <Button href="/custom-cake" variant="secondary" size="lg">
                Start Designing
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative aspect-square max-w-sm mx-auto"
            >
              <Image
                src="https://images.unsplash.com/photo-1557979619-445218f326b9?w=600&q=80"
                alt="Custom designer cake"
                fill
                sizes="400px"
                className="object-cover rounded-brand shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
