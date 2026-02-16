interface BadgeProps {
  type: "veg" | "eggless" | "contains-egg" | "non-veg";
  size?: "sm" | "md";
}

const badgeConfig = {
  veg: { label: "Veg", dotColor: "bg-green-500", borderColor: "border-green-500" },
  eggless: { label: "Eggless", dotColor: "bg-green-500", borderColor: "border-green-500" },
  "contains-egg": { label: "Egg", dotColor: "bg-red-500", borderColor: "border-red-500" },
  "non-veg": { label: "Non-Veg", dotColor: "bg-red-500", borderColor: "border-red-500" },
};

export default function Badge({ type, size = "sm" }: BadgeProps) {
  const config = badgeConfig[type];
  const sizeClasses = size === "sm" ? "text-xs px-1.5 py-0.5" : "text-sm px-2 py-1";
  const dotSize = size === "sm" ? "w-2 h-2" : "w-2.5 h-2.5";

  return (
    <span
      className={`inline-flex items-center gap-1 border ${config.borderColor} rounded ${sizeClasses} font-body font-medium`}
    >
      <span className={`${dotSize} rounded-full ${config.dotColor}`} />
      {config.label}
    </span>
  );
}
