"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Package,
  Clock,
  CheckCircle,
  ChefHat,
  Truck,
  XCircle,
  Home,
  ShoppingBag,
  Cake,
} from "lucide-react";
import { customCakeAPI } from "@/lib/api";
import Button from "@/components/ui/Button";

interface Order {
  _id: string;
  specifications: {
    shape: string;
    size: string;
    flavor: string;
    frostingType: string;
    frostingColor: string;
    filling: string;
    toppings: string[];
    theme: string;
    message: string;
    eggPreference: string;
  };
  aiPreviewImageUrl?: string;
  calculatedPrice: number;
  status: string;
  customerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof Clock; step: number }
> = {
  pending_review: {
    label: "Pending Review",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    icon: Clock,
    step: 1,
  },
  quoted: {
    label: "Quoted",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: Package,
    step: 2,
  },
  accepted: {
    label: "Accepted",
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
    icon: CheckCircle,
    step: 3,
  },
  in_production: {
    label: "In Production",
    color: "text-orange-700",
    bg: "bg-orange-50 border-orange-200",
    icon: ChefHat,
    step: 4,
  },
  ready: {
    label: "Ready",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: Truck,
    step: 5,
  },
  delivered: {
    label: "Delivered",
    color: "text-green-800",
    bg: "bg-green-100 border-green-300",
    icon: CheckCircle,
    step: 6,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
    step: 0,
  },
};

const trackingSteps = [
  { key: "pending_review", label: "Placed" },
  { key: "accepted", label: "Accepted" },
  { key: "in_production", label: "Baking" },
  { key: "ready", label: "Ready" },
  { key: "delivered", label: "Delivered" },
];

function OrderCard({ order }: { order: Order }) {
  const config = statusConfig[order.status] || statusConfig.pending_review;
  const StatusIcon = config.icon;
  const currentStep = config.step;
  const isCancelled = order.status === "cancelled";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-brand border border-brand-sage/20 overflow-hidden"
    >
      <div className="flex gap-4 p-4">
        {/* Cake Image */}
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-brand-cream/30">
          {order.aiPreviewImageUrl ? (
            <Image
              src={order.aiPreviewImageUrl}
              alt="Cake preview"
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Cake size={32} className="text-brand-sage" />
            </div>
          )}
        </div>

        {/* Order Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-text-primary text-sm">
                Custom {order.specifications.flavor} Cake
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                {order.specifications.shape} &middot; {order.specifications.size} &middot;{" "}
                {order.specifications.frostingType} frosting
              </p>
            </div>
            <span className="text-brand-red font-bold text-sm whitespace-nowrap">
              ₹{order.calculatedPrice}
            </span>
          </div>

          {/* Status Badge */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border mt-2 ${config.bg} ${config.color}`}>
            <StatusIcon size={12} />
            {config.label}
          </div>

          {order.specifications.message && (
            <p className="text-xs text-text-muted mt-1.5 italic">
              &ldquo;{order.specifications.message}&rdquo;
            </p>
          )}

          <p className="text-xs text-text-muted mt-1">
            Ordered {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Tracking Progress */}
      {!isCancelled && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-0">
            {trackingSteps.map((step, i) => {
              const stepNum = statusConfig[step.key]?.step || 0;
              const isCompleted = currentStep >= stepNum;
              const isActive = currentStep === stepNum;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? "bg-brand-red text-white"
                          : isActive
                            ? "bg-brand-red/20 text-brand-red border-2 border-brand-red"
                            : "bg-brand-sage/20 text-text-muted"
                      }`}
                    >
                      {isCompleted ? "✓" : i + 1}
                    </div>
                    <span className={`text-[10px] mt-1 whitespace-nowrap ${isCompleted ? "text-brand-red font-medium" : "text-text-muted"}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < trackingSteps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 mt-[-12px] ${
                        currentStep > stepNum ? "bg-brand-red" : "bg-brand-sage/20"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await customCakeAPI.getMyOrders();
        if (res.success) {
          setOrders(res.data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream/30">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-brand-sage/10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-text-muted">
            <Link href="/" className="flex items-center gap-1 hover:text-brand-red transition-colors">
              <Home size={14} />
              Home
            </Link>
            <span>/</span>
            <span className="flex items-center gap-1 text-brand-red font-medium">
              <Package size={14} />
              My Orders
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-text-primary mb-6">
          My Orders
        </h1>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-brand border border-brand-sage/20 p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg bg-brand-sage/20" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-brand-sage/20 rounded w-1/2" />
                    <div className="h-3 bg-brand-sage/20 rounded w-1/3" />
                    <div className="h-6 bg-brand-sage/20 rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-brand border border-brand-sage/20 p-8 text-center">
            <p className="text-text-secondary mb-4">{error}</p>
            <Button href="/" variant="outline">Back to Home</Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-brand border border-brand-sage/20 p-12 text-center">
            <ShoppingBag size={48} className="text-brand-sage mx-auto mb-4" />
            <h2 className="font-display text-xl font-bold text-text-primary mb-2">
              No orders yet
            </h2>
            <p className="text-text-muted text-sm mb-6">
              Design your first custom cake and it will show up here!
            </p>
            <Button href="/custom-cake">Design a Custom Cake</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
