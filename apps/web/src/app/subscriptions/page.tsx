"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Package, Truck, Heart } from "lucide-react";
import Button from "@/components/ui/Button";
import LaneTabs from "@/components/subscription/LaneTabs";
import PlanCard from "@/components/subscription/PlanCard";

/* ------------------------------------------------------------------ */
/*  Demo data                                                          */
/* ------------------------------------------------------------------ */

const DEMO_PLANS = [
  {
    name: "Protein Breakfast Box",
    slug: "protein-breakfast-box",
    shortDescription:
      "Start your day with high-protein muffins, cookies & energy bars.",
    image:
      "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=600&q=80",
    lane: "FRESH_CITY_ONLY",
    priceWeekly: 499,
    priceMonthly: 1599,
    targetNutritionTags: ["high_protein", "low_sugar"],
    subscriberCount: 234,
  },
  {
    name: "Low Sugar Snack Box",
    slug: "low-sugar-snack-box",
    shortDescription:
      "Guilt-free snacking with sugar-free brownies, biscuits & bars.",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    lane: "FRESH_CITY_ONLY",
    priceWeekly: 399,
    priceMonthly: 1299,
    targetNutritionTags: ["low_sugar", "sugar_free"],
    subscriberCount: 156,
  },
  {
    name: "Weekend Bakery Basket",
    slug: "weekend-bakery-basket",
    shortDescription:
      "Artisan breads, croissants & pastries for your weekend brunch.",
    image:
      "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600&q=80",
    lane: "FRESH_CITY_ONLY",
    priceWeekly: 599,
    priceMonthly: 1999,
    targetNutritionTags: ["whole_grain", "organic"],
    subscriberCount: 89,
  },
  {
    name: "Office Snack Pack",
    slug: "office-snack-pack",
    shortDescription:
      "Shelf-stable cookies, rusks & trail mixes shipped anywhere in India.",
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
    lane: "SHELF_STABLE_NATIONAL",
    priceWeekly: 349,
    priceMonthly: 1099,
    targetNutritionTags: ["high_fiber", "low_calorie"],
    subscriberCount: 412,
  },
  {
    name: "Healthy Morning Box",
    slug: "healthy-morning-box",
    shortDescription:
      "Granola, oat cookies & dry fruit bars delivered pan-India.",
    image:
      "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&q=80",
    lane: "SHELF_STABLE_NATIONAL",
    priceWeekly: 449,
    priceMonthly: 1399,
    targetNutritionTags: ["high_fiber", "gluten_free", "vegan"],
    subscriberCount: 178,
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const sectionFade = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  How-It-Works step data                                             */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    icon: Package,
    title: "Choose Your Plan",
    description:
      "Pick a curated box or build your own based on dietary goals and taste.",
  },
  {
    icon: Truck,
    title: "We Deliver",
    description:
      "Fresh boxes reach your door same-day in your city; shelf-stable ships pan-India.",
  },
  {
    icon: Heart,
    title: "Enjoy & Manage",
    description:
      "Pause, swap items, or change frequency anytime from your dashboard.",
  },
];

/* ------------------------------------------------------------------ */
/*  Page component                                                     */
/* ------------------------------------------------------------------ */

export default function SubscriptionsPage() {
  const [selectedLane, setSelectedLane] = useState("FRESH_CITY_ONLY");
  const plansRef = useRef<HTMLDivElement>(null);

  const filteredPlans = DEMO_PLANS.filter((p) => p.lane === selectedLane);

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen">
      {/* ============================================================ */}
      {/*  Hero Section                                                 */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionFade}
        className="relative overflow-hidden bg-gradient-to-br from-brand-sage via-brand-sage-light to-brand-cream"
      >
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-red/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-brand-sage-dark/20 blur-2xl" />

        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center sm:py-32">
          <h1 className="font-display text-4xl font-bold leading-tight text-text-primary sm:text-5xl lg:text-6xl">
            Health Food Subscriptions
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-text-secondary font-body leading-relaxed">
            Fresh, nutritious treats delivered to your door—weekly, biweekly, or
            monthly.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button variant="primary" size="lg" onClick={scrollToPlans}>
              Browse Plans
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="/subscriptions/build-your-own"
            >
              Build Your Own
            </Button>
          </div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  Lane Tabs + Featured Plans Grid                              */}
      {/* ============================================================ */}
      <section ref={plansRef} className="mx-auto max-w-6xl px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionFade}
        >
          <h2 className="font-display text-3xl font-bold text-text-primary">
            Featured Plans
          </h2>
          <p className="mt-2 text-text-muted font-body">
            Choose a delivery lane that suits you best.
          </p>

          <div className="mt-6">
            <LaneTabs
              selectedLane={selectedLane}
              onLaneChange={setSelectedLane}
              showFreshTab={true}
            />
          </div>
        </motion.div>

        {/* Plan cards grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan, i) => (
            <motion.div
              key={plan.slug}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={fadeUp}
            >
              <PlanCard plan={plan} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  Build Your Own CTA                                           */}
      {/* ============================================================ */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionFade}
        className="bg-brand-cream"
      >
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
            Build Your Own Box
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-text-secondary font-body leading-relaxed">
            Can't find the perfect plan? Customize a box around your health
            goals, dietary needs, and budget. Mix protein snacks, sugar-free
            treats, and wholesome bakes — all in one box.
          </p>
          <div className="mt-8">
            <Button
              variant="primary"
              size="lg"
              href="/subscriptions/build-your-own"
            >
              Start Building
            </Button>
          </div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  How It Works                                                 */}
      {/* ============================================================ */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={sectionFade}
          className="text-center"
        >
          <h2 className="font-display text-3xl font-bold text-text-primary sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-text-muted font-body">
            Three simple steps to delicious, healthy deliveries.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                className="flex flex-col items-center text-center"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-sage/40">
                  <Icon size={28} className="text-brand-red" strokeWidth={2} />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs text-sm text-text-muted font-body leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
