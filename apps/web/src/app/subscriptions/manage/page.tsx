"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package, Calendar, Repeat } from "lucide-react";
import Button from "@/components/ui/Button";
import SubscriptionStatusBadge from "@/components/subscription/SubscriptionStatusBadge";

/* ------------------------------------------------------------------ */
/*  Demo data                                                          */
/* ------------------------------------------------------------------ */

const DEMO_SUBSCRIPTIONS = [
  {
    _id: "sub_001",
    planName: "Protein Breakfast Box",
    lane: "FRESH_CITY_ONLY",
    status: "active",
    frequency: "weekly",
    nextDeliveryDate: "2026-02-24",
    totalAmount: 499,
    items: 3,
    image:
      "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&q=80",
  },
  {
    _id: "sub_002",
    planName: "Office Snack Pack",
    lane: "SHELF_STABLE_NATIONAL",
    status: "paused",
    frequency: "monthly",
    nextDeliveryDate: "2026-03-15",
    totalAmount: 1099,
    items: 4,
    image:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const LANE_LABELS: Record<string, string> = {
  FRESH_CITY_ONLY: "Fresh Local",
  SHELF_STABLE_NATIONAL: "Pan-India",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(amount: number): string {
  return `\u20B9${amount.toLocaleString("en-IN")}`;
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ------------------------------------------------------------------ */
/*  Subscription Card                                                  */
/* ------------------------------------------------------------------ */

function SubscriptionCard({
  subscription,
}: {
  subscription: (typeof DEMO_SUBSCRIPTIONS)[number];
}) {
  return (
    <div className="bg-white rounded-brand border border-brand-sage/20 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="relative h-44 w-full">
        <Image
          src={subscription.image}
          alt={subscription.planName}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Lane badge overlay */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold font-body bg-white/90 text-text-primary backdrop-blur-sm shadow-sm">
            {LANE_LABELS[subscription.lane] || subscription.lane}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Plan name + Status */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <h3 className="font-display text-lg font-bold text-text-primary leading-tight">
            {subscription.planName}
          </h3>
          <SubscriptionStatusBadge status={subscription.status} />
        </div>

        {/* Meta info */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-2 text-sm text-text-secondary font-body">
            <Repeat size={15} className="text-text-muted flex-shrink-0" />
            <span>{capitalizeFirst(subscription.frequency)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary font-body">
            <Calendar size={15} className="text-text-muted flex-shrink-0" />
            <span>Next: {formatDate(subscription.nextDeliveryDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary font-body">
            <Package size={15} className="text-text-muted flex-shrink-0" />
            <span>
              {subscription.items} item{subscription.items !== 1 ? "s" : ""} per
              delivery
            </span>
          </div>
        </div>

        {/* Price + Manage */}
        <div className="flex items-center justify-between pt-4 border-t border-brand-sage/20">
          <div>
            <span className="text-xs text-text-muted font-body block">
              Total per delivery
            </span>
            <span className="text-lg font-bold font-display text-brand-red">
              {formatPrice(subscription.totalAmount)}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            href={`/subscriptions/manage/${subscription._id}`}
          >
            Manage
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-sage/30 mb-6">
        <Package size={36} className="text-text-muted" strokeWidth={1.5} />
      </div>
      <h2 className="font-display text-2xl font-bold text-text-primary mb-2">
        No active subscriptions
      </h2>
      <p className="text-text-muted font-body max-w-md mb-8">
        You don&apos;t have any subscription plans yet. Browse our curated boxes
        or build your own to get started with healthy, delicious deliveries.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="primary" size="md" href="/subscriptions">
          Browse Plans
        </Button>
        <Button
          variant="outline"
          size="md"
          href="/subscriptions/build-your-own"
        >
          Build Your Own
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function ManageSubscriptionsPage() {
  const [subscriptions] = useState(DEMO_SUBSCRIPTIONS);

  return (
    <main className="min-h-screen bg-brand-cream/40">
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-text-primary">
            My Subscriptions
          </h1>
          <p className="mt-2 text-text-muted font-body">
            Manage your active plans, pause deliveries, or change frequency.
          </p>
        </div>

        {/* Content */}
        {subscriptions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subscriptions.map((sub) => (
              <SubscriptionCard key={sub._id} subscription={sub} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
