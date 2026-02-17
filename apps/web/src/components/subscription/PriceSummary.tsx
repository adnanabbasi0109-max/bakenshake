"use client";

interface PriceSummaryProps {
  subtotal: number;
  discountAmount: number;
  deliveryCharge: number;
  taxAmount: number;
  totalAmount: number;
  discountLabel?: string;
}

export default function PriceSummary({
  subtotal,
  discountAmount,
  deliveryCharge,
  taxAmount,
  totalAmount,
  discountLabel = "Subscription Discount",
}: PriceSummaryProps) {
  const formatPrice = (amount: number) =>
    `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-white rounded-brand p-5 shadow-sm border border-brand-sage/20">
      <h3 className="font-display text-lg font-bold text-text-primary mb-4">
        Price Summary
      </h3>

      <div className="space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-sm font-body">
          <span className="text-text-secondary">Subtotal</span>
          <span className="text-text-primary font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Discount */}
        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-sm font-body">
            <span className="text-green-600">{discountLabel}</span>
            <span className="text-green-600 font-medium">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        {/* Delivery */}
        <div className="flex justify-between items-center text-sm font-body">
          <span className="text-text-secondary">Delivery Charge</span>
          <span className="text-text-primary font-medium">
            {deliveryCharge === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatPrice(deliveryCharge)
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center text-sm font-body">
          <span className="text-text-secondary">Tax (GST)</span>
          <span className="text-text-primary font-medium">{formatPrice(taxAmount)}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-brand-sage/30 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-base font-bold font-body text-text-primary">Total</span>
            <span className="text-lg font-bold font-display text-brand-red">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
