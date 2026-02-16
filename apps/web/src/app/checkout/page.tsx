"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Script from "next/script";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { paymentAPI } from "@/lib/api";
import Button from "@/components/ui/Button";

declare global {
  interface Window {
    Razorpay: new (options: {
      key: string;
      amount: number;
      order_id: string;
      name: string;
      description?: string;
      handler: (res: {
        razorpay_payment_id: string;
        razorpay_order_id: string;
        razorpay_signature: string;
      }) => void;
      prefill?: { name?: string; email?: string; contact?: string };
    }) => { open: () => void; on: (event: string, callback: () => void) => void };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const gst = Math.round(subtotal * 0.05);
  const deliveryCharge = subtotal >= 499 ? 0 : 49;
  const total = subtotal + gst + deliveryCharge;
  const totalPaise = Math.round(total * 100);

  const handlePay = useCallback(async () => {
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (totalPaise < 100) {
      setError("Amount must be at least ₹1.");
      return;
    }
    setError(null);
    setIsPaying(true);
    try {
      const { orderId, keyId } = await paymentAPI.createOrder(totalPaise);
      if (!orderId || !keyId) {
        setError("Could not create payment order.");
        setIsPaying(false);
        return;
      }
      if (typeof window === "undefined" || !window.Razorpay) {
        setError("Razorpay failed to load. Please refresh and try again.");
        setIsPaying(false);
        return;
      }
      const rzp = new window.Razorpay({
        key: keyId,
        amount: totalPaise,
        order_id: orderId,
        name: "Bake n Shake",
        description: "Order payment",
        handler: async (res) => {
          try {
            await paymentAPI.verify({
              razorpay_order_id: res.razorpay_order_id,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_signature: res.razorpay_signature,
            });
            clearCart();
            router.push("/checkout/success");
          } catch {
            setError("Payment verification failed. Please contact support.");
          } finally {
            setIsPaying(false);
          }
        },
      });
      rzp.on("payment.failed", () => {
        setError("Payment failed or was cancelled.");
        setIsPaying(false);
      });
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment could not be started.");
      setIsPaying(false);
    }
  }, [items.length, totalPaise, clearCart, router]);

  useEffect(() => {
    if (items.length === 0 && !isPaying) {
      router.replace("/");
    }
  }, [items.length, isPaying, router]);

  if (items.length === 0 && !isPaying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Redirecting...</p>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
        onLoad={() => {}}
      />
      <div className="min-h-screen bg-brand-cream/30 py-12 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-2xl font-bold text-brand-red mb-6">
            Checkout
          </h1>

          <div className="bg-white rounded-brand shadow p-6 space-y-4 mb-6">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>GST (5%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Delivery</span>
              <span>{deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span className="text-brand-red">₹{total}</span>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4" role="alert">
              {error}
            </p>
          )}

          <Button
            fullWidth
            size="lg"
            onClick={handlePay}
            disabled={isPaying}
          >
            {isPaying ? "Opening Razorpay..." : "Pay ₹" + total + " with Razorpay"}
          </Button>

          <p className="text-center text-sm text-text-muted mt-4">
            <Link href="/" className="text-brand-red hover:underline">
              Continue shopping
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
