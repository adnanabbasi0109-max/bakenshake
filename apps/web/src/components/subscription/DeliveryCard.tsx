"use client";

import { Package, Calendar, SkipForward, Undo2 } from "lucide-react";
import SubscriptionStatusBadge from "@/components/subscription/SubscriptionStatusBadge";

interface DeliveryItem {
  productId: string;
  name: string;
  quantity: number;
}

interface Delivery {
  _id: string;
  deliveryNumber: number;
  scheduledDate: string;
  status: string;
  items: DeliveryItem[];
  totalAmount: number;
  editCutoffAt: string;
  isSkipped: boolean;
}

interface DeliveryCardProps {
  delivery: Delivery;
  onSkip?: (deliveryId: string) => void;
  onUnskip?: (deliveryId: string) => void;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function isBeforeCutoff(cutoffStr: string): boolean {
  return new Date() < new Date(cutoffStr);
}

export default function DeliveryCard({ delivery, onSkip, onUnskip }: DeliveryCardProps) {
  const canModify =
    delivery.status === "upcoming" && isBeforeCutoff(delivery.editCutoffAt);
  const itemCount = delivery.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`bg-white rounded-brand p-4 border transition-colors ${
        delivery.isSkipped
          ? "border-brand-sage/30 opacity-60"
          : "border-brand-sage/20 shadow-sm"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-base font-bold text-text-primary">
              Delivery #{delivery.deliveryNumber}
            </span>
            <SubscriptionStatusBadge
              status={delivery.isSkipped ? "paused" : delivery.status}
            />
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-sm text-text-muted font-body">
            <Calendar size={13} />
            <span>{formatDate(delivery.scheduledDate)}</span>
          </div>
        </div>

        {/* Skip / Unskip */}
        {canModify && !delivery.isSkipped && onSkip && (
          <button
            onClick={() => onSkip(delivery._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-body text-amber-600 bg-amber-50 rounded-brand hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <SkipForward size={13} />
            Skip
          </button>
        )}
        {delivery.isSkipped && onUnskip && (
          <button
            onClick={() => onUnskip(delivery._id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold font-body text-brand-red bg-brand-red/10 rounded-brand hover:bg-brand-red/20 transition-colors cursor-pointer"
          >
            <Undo2 size={13} />
            Unskip
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between pt-3 border-t border-brand-sage/20">
        <div className="flex items-center gap-1.5 text-sm text-text-secondary font-body">
          <Package size={14} />
          <span>
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </span>
        </div>
        <span className="text-sm font-bold text-brand-red font-body">
          ₹{delivery.totalAmount.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
