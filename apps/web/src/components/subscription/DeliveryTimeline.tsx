"use client";

import DeliveryCard from "@/components/subscription/DeliveryCard";

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

interface DeliveryTimelineProps {
  deliveries: Delivery[];
  onSkip?: (deliveryId: string) => void;
  onUnskip?: (deliveryId: string) => void;
}

const STATUS_DOT_COLORS: Record<string, string> = {
  delivered: "bg-green-500",
  upcoming: "bg-brand-red",
  skipped: "bg-amber-400",
  processing: "bg-blue-500",
};

export default function DeliveryTimeline({
  deliveries,
  onSkip,
  onUnskip,
}: DeliveryTimelineProps) {
  if (!deliveries || deliveries.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted font-body text-sm">
        No deliveries scheduled yet.
      </div>
    );
  }

  return (
    <div className="relative">
      {deliveries.map((delivery, index) => {
        const isLast = index === deliveries.length - 1;
        const dotColor =
          delivery.isSkipped
            ? "bg-amber-400"
            : STATUS_DOT_COLORS[delivery.status] || "bg-gray-300";

        return (
          <div key={delivery._id} className="relative flex gap-4">
            {/* Timeline track */}
            <div className="flex flex-col items-center">
              {/* Dot */}
              <div
                className={`w-3 h-3 rounded-full flex-shrink-0 mt-5 ring-4 ring-white ${dotColor}`}
              />
              {/* Connecting line */}
              {!isLast && (
                <div className="w-0.5 flex-1 bg-brand-sage/30 min-h-[16px]" />
              )}
            </div>

            {/* Card */}
            <div className="flex-1 pb-4">
              <DeliveryCard
                delivery={delivery}
                onSkip={onSkip}
                onUnskip={onUnskip}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
