"use client";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#059669", bg: "#05966926" },
  paused: { label: "Paused", color: "#D97706", bg: "#D9770626" },
  cancelled: { label: "Cancelled", color: "#DC2626", bg: "#DC262626" },
  pending: { label: "Pending", color: "#2563EB", bg: "#2563EB26" },
  expired: { label: "Expired", color: "#6B7280", bg: "#6B728026" },
  trial: { label: "Trial", color: "#7C3AED", bg: "#7C3AED26" },
};

interface SubscriptionStatusBadgeProps {
  status: string;
}

export default function SubscriptionStatusBadge({ status }: SubscriptionStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || {
    label: status.charAt(0).toUpperCase() + status.slice(1),
    color: "#6B7280",
    bg: "#6B728026",
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-body"
      style={{
        backgroundColor: config.bg,
        color: config.color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
}
