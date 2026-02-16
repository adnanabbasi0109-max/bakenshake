"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Pause,
  Play,
  XCircle,
  Calendar,
  MapPin,
  Repeat,
} from "lucide-react";
import Button from "@/components/ui/Button";
import SubscriptionStatusBadge from "@/components/subscription/SubscriptionStatusBadge";
import DeliveryTimeline from "@/components/subscription/DeliveryTimeline";
import PriceSummary from "@/components/subscription/PriceSummary";

/* ------------------------------------------------------------------ */
/*  Demo data                                                          */
/* ------------------------------------------------------------------ */

const DEMO_SUBSCRIPTION = {
  _id: "sub_001",
  planName: "Protein Breakfast Box",
  lane: "FRESH_CITY_ONLY",
  status: "active",
  frequency: "weekly",
  nextDeliveryDate: "2026-02-24",
  subtotal: 460,
  discountAmount: 46,
  deliveryCharge: 0,
  taxAmount: 21,
  totalAmount: 435,
  address: {
    line1: "123 Main Street",
    line2: "Arera Colony",
    city: "Bhopal",
    state: "Madhya Pradesh",
    pincode: "462016",
  },
  deliveries: [
    {
      _id: "del_001",
      deliveryNumber: 1,
      scheduledDate: "2026-02-24",
      status: "upcoming",
      items: [
        { productId: "p1", name: "Whey Protein Muffin", quantity: 1 },
        { productId: "p2", name: "PB Energy Cookie", quantity: 1 },
        { productId: "p3", name: "Oats Breakfast Bar", quantity: 1 },
      ],
      totalAmount: 435,
      editCutoffAt: "2026-02-23T08:00:00Z",
      isSkipped: false,
    },
    {
      _id: "del_002",
      deliveryNumber: 2,
      scheduledDate: "2026-03-03",
      status: "upcoming",
      items: [
        { productId: "p1", name: "Whey Protein Muffin", quantity: 1 },
        { productId: "p2", name: "PB Energy Cookie", quantity: 1 },
        { productId: "p3", name: "Oats Breakfast Bar", quantity: 1 },
      ],
      totalAmount: 435,
      editCutoffAt: "2026-03-02T08:00:00Z",
      isSkipped: false,
    },
    {
      _id: "del_003",
      deliveryNumber: 3,
      scheduledDate: "2026-03-10",
      status: "upcoming",
      items: [
        { productId: "p1", name: "Whey Protein Muffin", quantity: 1 },
        { productId: "p2", name: "PB Energy Cookie", quantity: 1 },
        { productId: "p3", name: "Oats Breakfast Bar", quantity: 1 },
      ],
      totalAmount: 435,
      editCutoffAt: "2026-03-09T08:00:00Z",
      isSkipped: false,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const LANE_LABELS: Record<string, string> = {
  FRESH_CITY_ONLY: "Fresh Local",
  SHELF_STABLE_NATIONAL: "Pan-India",
};

const FREQUENCY_OPTIONS = ["weekly", "biweekly", "monthly"] as const;

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function SubscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [status, setStatus] = useState(DEMO_SUBSCRIPTION.status);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [frequency, setFrequency] = useState(DEMO_SUBSCRIPTION.frequency);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [deliveries, setDeliveries] = useState(DEMO_SUBSCRIPTION.deliveries);

  /* ---- Action handlers ---- */

  const handleTogglePause = () => {
    setStatus((prev) => (prev === "active" ? "paused" : "active"));
  };

  const handleCancelConfirm = () => {
    setStatus("cancelled");
    setShowCancelConfirm(false);
  };

  const handleFrequencyChange = (newFreq: string) => {
    setFrequency(newFreq);
    setShowFrequencyPicker(false);
  };

  const handleSkip = (deliveryId: string) => {
    setDeliveries((prev) =>
      prev.map((d) => (d._id === deliveryId ? { ...d, isSkipped: true } : d))
    );
  };

  const handleUnskip = (deliveryId: string) => {
    setDeliveries((prev) =>
      prev.map((d) => (d._id === deliveryId ? { ...d, isSkipped: false } : d))
    );
  };

  const isCancelled = status === "cancelled";

  return (
    <main className="min-h-screen bg-brand-cream/40">
      <div className="mx-auto max-w-4xl px-6 py-10">
        {/* ============================================================ */}
        {/*  Back link                                                    */}
        {/* ============================================================ */}
        <Link
          href="/subscriptions/manage"
          className="inline-flex items-center gap-1.5 text-sm font-semibold font-body text-brand-red hover:text-brand-red-dark transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          My Subscriptions
        </Link>

        {/* ============================================================ */}
        {/*  Subscription Header                                          */}
        {/* ============================================================ */}
        <div className="bg-white rounded-brand p-6 shadow-sm border border-brand-sage/20 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-text-primary">
                {DEMO_SUBSCRIPTION.planName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <SubscriptionStatusBadge status={status} />
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body bg-brand-sage/20 text-text-secondary">
                  <Repeat size={12} />
                  {capitalizeFirst(frequency)}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body bg-brand-cream text-text-secondary">
                  {LANE_LABELS[DEMO_SUBSCRIPTION.lane] ||
                    DEMO_SUBSCRIPTION.lane}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-text-muted font-body block">
                Next delivery
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-text-primary font-body">
                <Calendar size={14} className="text-text-muted" />
                {formatDate(DEMO_SUBSCRIPTION.nextDeliveryDate)}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Quick Actions Row                                            */}
        {/* ============================================================ */}
        {!isCancelled && (
          <div className="flex flex-wrap gap-3 mb-8">
            {/* Pause / Resume */}
            <Button
              variant={status === "active" ? "outline" : "primary"}
              size="sm"
              onClick={handleTogglePause}
            >
              {status === "active" ? (
                <>
                  <Pause size={16} className="mr-1.5" />
                  Pause Subscription
                </>
              ) : (
                <>
                  <Play size={16} className="mr-1.5" />
                  Resume Subscription
                </>
              )}
            </Button>

            {/* Cancel */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCancelConfirm(true)}
            >
              <XCircle size={16} className="mr-1.5" />
              Cancel Subscription
            </Button>

            {/* Change Frequency */}
            <div className="relative">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFrequencyPicker((prev) => !prev)}
              >
                <Repeat size={16} className="mr-1.5" />
                Change Frequency
              </Button>

              {/* Frequency dropdown */}
              {showFrequencyPicker && (
                <div className="absolute top-full left-0 mt-2 z-20 bg-white rounded-brand shadow-lg border border-brand-sage/20 py-1 min-w-[160px]">
                  {FREQUENCY_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleFrequencyChange(opt)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-body transition-colors cursor-pointer ${
                        frequency === opt
                          ? "bg-brand-red/10 text-brand-red font-semibold"
                          : "text-text-secondary hover:bg-brand-sage/10"
                      }`}
                    >
                      {capitalizeFirst(opt)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cancelled notice */}
        {isCancelled && (
          <div className="mb-8 rounded-brand border border-red-200 bg-red-50 p-4 text-sm font-body text-red-700">
            This subscription has been cancelled. No further deliveries will be
            made.
          </div>
        )}

        {/* ============================================================ */}
        {/*  Two-column layout: Timeline + Sidebar                        */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Delivery Timeline (2 cols) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-brand p-6 shadow-sm border border-brand-sage/20">
              <h2 className="font-display text-xl font-bold text-text-primary mb-5">
                Upcoming Deliveries
              </h2>
              <DeliveryTimeline
                deliveries={deliveries}
                onSkip={handleSkip}
                onUnskip={handleUnskip}
              />
            </div>
          </div>

          {/* Right: Address + Price Summary (1 col) */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-brand p-5 shadow-sm border border-brand-sage/20">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-brand-red" />
                <h3 className="font-display text-lg font-bold text-text-primary">
                  Delivery Address
                </h3>
              </div>
              <div className="text-sm text-text-secondary font-body leading-relaxed">
                <p>{DEMO_SUBSCRIPTION.address.line1}</p>
                {DEMO_SUBSCRIPTION.address.line2 && (
                  <p>{DEMO_SUBSCRIPTION.address.line2}</p>
                )}
                <p>
                  {DEMO_SUBSCRIPTION.address.city},{" "}
                  {DEMO_SUBSCRIPTION.address.state}
                </p>
                <p className="font-medium text-text-primary mt-1">
                  {DEMO_SUBSCRIPTION.address.pincode}
                </p>
              </div>
              <button className="mt-4 text-xs font-semibold font-body text-brand-red hover:text-brand-red-dark transition-colors cursor-pointer">
                Change Address
              </button>
            </div>

            {/* Price Summary */}
            <PriceSummary
              subtotal={DEMO_SUBSCRIPTION.subtotal}
              discountAmount={DEMO_SUBSCRIPTION.discountAmount}
              deliveryCharge={DEMO_SUBSCRIPTION.deliveryCharge}
              taxAmount={DEMO_SUBSCRIPTION.taxAmount}
              totalAmount={DEMO_SUBSCRIPTION.totalAmount}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/*  Cancel Confirmation Modal                                    */}
        {/* ============================================================ */}
        {showCancelConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCancelConfirm(false)}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-brand p-6 shadow-xl max-w-md w-full border border-brand-sage/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <XCircle size={20} className="text-red-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-text-primary">
                  Cancel Subscription?
                </h3>
              </div>

              <p className="text-sm text-text-secondary font-body leading-relaxed mb-6">
                Are you sure you want to cancel your{" "}
                <strong>{DEMO_SUBSCRIPTION.planName}</strong> subscription? This
                action cannot be undone and all upcoming deliveries will be
                stopped.
              </p>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Keep Subscription
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCancelConfirm}
                  className="!bg-red-600 hover:!bg-red-700"
                >
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
