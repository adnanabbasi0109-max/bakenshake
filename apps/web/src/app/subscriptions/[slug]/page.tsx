"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import NutritionTagBadge from "@/components/subscription/NutritionTagBadge";
import BasketPreview from "@/components/subscription/BasketPreview";
import FrequencySelector from "@/components/subscription/FrequencySelector";
import PriceSummary from "@/components/subscription/PriceSummary";
import SwapModal, { DEMO_PRODUCTS } from "@/components/subscription/SwapModal";

/* -------------------------------------------------------------------------- */
/*  Demo Data                                                                 */
/* -------------------------------------------------------------------------- */

interface PlanItem {
  productId: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  isSwappable?: boolean;
}

interface PlanData {
  name: string;
  description: string;
  image: string;
  lane: string;
  priceWeekly: number;
  priceBiweekly: number;
  priceMonthly: number;
  targetNutritionTags: string[];
  subscriberCount: number;
  items: PlanItem[];
}

const DEMO_PLANS: Record<string, PlanData> = {
  "protein-breakfast-box": {
    name: "Protein Breakfast Box",
    description:
      "Start your mornings right with our curated selection of high-protein baked goods. Each box includes protein-packed muffins, energy cookies, and wholesome breakfast bars made with whey protein, oats, and nuts.",
    image:
      "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=1200&q=80",
    lane: "FRESH_CITY_ONLY",
    priceWeekly: 499,
    priceBiweekly: 899,
    priceMonthly: 1599,
    targetNutritionTags: ["high_protein", "low_sugar"],
    subscriberCount: 234,
    items: [
      {
        productId: "p1",
        name: "Whey Protein Muffin (2pc)",
        image:
          "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200&q=80",
        quantity: 1,
        price: 180,
        isSwappable: true,
      },
      {
        productId: "p2",
        name: "Peanut Butter Energy Cookie (4pc)",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&q=80",
        quantity: 1,
        price: 160,
        isSwappable: true,
      },
      {
        productId: "p3",
        name: "Oats & Almond Breakfast Bar (3pc)",
        image:
          "https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=200&q=80",
        quantity: 1,
        price: 120,
        isSwappable: true,
      },
    ],
  },
  "low-sugar-snack-box": {
    name: "Low Sugar Snack Box",
    description:
      "Satisfy your cravings without the sugar crash. Enjoy sugar-free brownies, almond biscuits, and keto-friendly muffins made with natural sweeteners.",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
    lane: "FRESH_CITY_ONLY",
    priceWeekly: 399,
    priceBiweekly: 749,
    priceMonthly: 1299,
    targetNutritionTags: ["low_sugar", "sugar_free"],
    subscriberCount: 156,
    items: [
      {
        productId: "p4",
        name: "Sugar-Free Almond Brownie (3pc)",
        image:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=200&q=80",
        quantity: 1,
        price: 150,
        isSwappable: true,
      },
      {
        productId: "p5",
        name: "Keto Chocolate Muffin (2pc)",
        image:
          "https://images.unsplash.com/photo-1685100979994-b6f8384c345c?w=200&q=80",
        quantity: 1,
        price: 180,
        isSwappable: true,
      },
      {
        productId: "p6",
        name: "Stevia Oat Cookie (4pc)",
        image:
          "https://images.unsplash.com/photo-1497051788611-2c64812349fa?w=200&q=80",
        quantity: 1,
        price: 100,
        isSwappable: true,
      },
    ],
  },
};

const LANE_LABELS: Record<string, string> = {
  FRESH_CITY_ONLY: "Fresh Local",
  SHELF_STABLE_NATIONAL: "Pan-India",
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function slugToName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function buildFallbackPlan(slug: string): PlanData {
  return {
    name: slugToName(slug),
    description:
      "A thoughtfully curated subscription box with our finest baked goods, delivered fresh to your doorstep.",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
    lane: "FRESH_CITY_ONLY",
    priceWeekly: 449,
    priceBiweekly: 799,
    priceMonthly: 1399,
    targetNutritionTags: [],
    subscriberCount: 0,
    items: [
      {
        productId: "fb1",
        name: "Assorted Muffin Pack (3pc)",
        image:
          "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=200&q=80",
        quantity: 1,
        price: 160,
        isSwappable: true,
      },
      {
        productId: "fb2",
        name: "Classic Cookie Box (4pc)",
        image:
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=200&q=80",
        quantity: 1,
        price: 140,
        isSwappable: true,
      },
      {
        productId: "fb3",
        name: "Artisan Bread Loaf",
        image:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&q=80",
        quantity: 1,
        price: 120,
        isSwappable: true,
      },
    ],
  };
}

function calculatePricing(plan: PlanData, frequency: string, items?: PlanItem[]) {
  const subtotal = (items ?? plan.items).reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = Math.round(subtotal * 0.1);
  const afterDiscount = subtotal - discountAmount;

  let deliveryCharge: number;
  if (plan.lane === "SHELF_STABLE_NATIONAL") {
    deliveryCharge = 99;
  } else {
    // FRESH_CITY_ONLY — free delivery if after-discount subtotal > 499
    deliveryCharge = afterDiscount > 499 ? 0 : 49;
  }

  const taxAmount = Math.round((afterDiscount + deliveryCharge) * 0.05);
  const totalAmount = afterDiscount + deliveryCharge + taxAmount;

  // The price shown on the CTA depends on the selected frequency
  let displayPrice: number;
  if (frequency === "biweekly") {
    displayPrice = plan.priceBiweekly;
  } else if (frequency === "monthly") {
    displayPrice = plan.priceMonthly;
  } else {
    displayPrice = plan.priceWeekly;
  }

  return { subtotal, discountAmount, deliveryCharge, taxAmount, totalAmount, displayPrice };
}

/* -------------------------------------------------------------------------- */
/*  Page Component                                                            */
/* -------------------------------------------------------------------------- */

export default function SubscriptionPlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const plan: PlanData = DEMO_PLANS[slug] ?? buildFallbackPlan(slug);

  const [selectedFrequency, setSelectedFrequency] = useState("weekly");
  const [basketItems, setBasketItems] = useState(plan.items);
  const [swapModalOpen, setSwapModalOpen] = useState(false);
  const [currentProductId, setCurrentProductId] = useState("");

  const frequencies = [
    { value: "weekly", label: "Weekly", price: plan.priceWeekly },
    { value: "biweekly", label: "Bi-weekly", price: plan.priceBiweekly },
    { value: "monthly", label: "Monthly", price: plan.priceMonthly },
  ];

  const { subtotal, discountAmount, deliveryCharge, taxAmount, totalAmount, displayPrice } =
    calculatePricing(plan, selectedFrequency, basketItems);

  const handleSwap = (productId: string) => {
    setCurrentProductId(productId);
    setSwapModalOpen(true);
  };

  const handleSwapConfirm = (newProductId: string, _newVariantIndex: number) => {
    const newProduct = DEMO_PRODUCTS.find((p) => p.productId === newProductId);
    if (newProduct) {
      setBasketItems((prev) =>
        prev.map((item) =>
          item.productId === currentProductId
            ? { ...item, productId: newProduct.productId, name: newProduct.name, image: newProduct.image, price: newProduct.price }
            : item
        )
      );
    }
    setSwapModalOpen(false);
    setCurrentProductId("");
  };

  return (
    <main className="min-h-screen bg-brand-cream">
      {/* ------------------------------------------------------------------ */}
      {/*  Back Link                                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link
          href="/subscriptions"
          className="inline-flex items-center gap-1.5 text-sm font-semibold font-body text-brand-red hover:text-brand-red-dark transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Plans
        </Link>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Hero Banner                                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className="relative aspect-[21/9] rounded-brand overflow-hidden bg-brand-sage/20">
          <Image
            src={plan.image}
            alt={plan.name}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {/* Plan name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white drop-shadow-lg">
              {plan.name}
            </h1>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Content                                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* ------ Plan Info ------ */}
        <section className="bg-white rounded-brand p-5 sm:p-6 shadow-sm border border-brand-sage/20">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <h2 className="font-display text-2xl font-bold text-text-primary">
              {plan.name}
            </h2>
            <span className="inline-flex items-center bg-brand-sage/20 text-text-primary text-xs font-semibold font-body px-3 py-1 rounded-full">
              {LANE_LABELS[plan.lane] || plan.lane}
            </span>
          </div>

          <p className="text-text-secondary font-body text-sm leading-relaxed mb-4">
            {plan.description}
          </p>

          {/* Nutrition tags */}
          {plan.targetNutritionTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {plan.targetNutritionTags.map((tag) => (
                <NutritionTagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}

          {/* Subscriber count */}
          {plan.subscriberCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-text-muted font-body">
              <Users size={14} />
              <span>
                {plan.subscriberCount.toLocaleString("en-IN")} subscribers
              </span>
            </div>
          )}
        </section>

        {/* ------ Basket Preview ------ */}
        <section className="bg-white rounded-brand p-5 sm:p-6 shadow-sm border border-brand-sage/20">
          <BasketPreview
            items={basketItems}
            onSwap={handleSwap}
            title="What's in your box"
          />
        </section>

        {/* ------ Frequency Selector ------ */}
        <section className="bg-white rounded-brand p-5 sm:p-6 shadow-sm border border-brand-sage/20">
          <h3 className="font-display text-lg font-bold text-text-primary mb-3">
            Delivery Frequency
          </h3>
          <FrequencySelector
            frequencies={frequencies}
            selected={selectedFrequency}
            onChange={setSelectedFrequency}
          />
        </section>

        {/* ------ Price Summary ------ */}
        <PriceSummary
          subtotal={subtotal}
          discountAmount={discountAmount}
          deliveryCharge={deliveryCharge}
          taxAmount={taxAmount}
          totalAmount={totalAmount}
        />

        {/* ------ Subscribe CTA ------ */}
        <Button variant="primary" size="lg" fullWidth>
          Subscribe Now — ₹{displayPrice.toLocaleString("en-IN")}/week
        </Button>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/*  Swap Modal                                                        */}
      {/* ------------------------------------------------------------------ */}
      <SwapModal
        isOpen={swapModalOpen}
        onClose={() => {
          setSwapModalOpen(false);
          setCurrentProductId("");
        }}
        currentProductId={currentProductId}
        planSlug={slug}
        onSwapConfirm={handleSwapConfirm}
      />
    </main>
  );
}
