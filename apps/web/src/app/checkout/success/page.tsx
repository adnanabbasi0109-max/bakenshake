"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-brand-cream/30 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-brand shadow-lg p-8 max-w-md text-center">
        <h1 className="font-display text-2xl font-bold text-brand-red mb-2">
          Thank you!
        </h1>
        <p className="text-text-secondary mb-6">
          Your payment was successful. We&apos;ll prepare your order and get in touch for delivery.
        </p>
        <div className="flex gap-3">
          <Button href="/orders" variant="outline" fullWidth>
            Track Order
          </Button>
          <Button href="/" fullWidth>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
