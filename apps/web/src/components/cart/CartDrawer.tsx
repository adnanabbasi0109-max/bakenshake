"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
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

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getSubtotal, clearCart } = useCartStore();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const gst = Math.round(subtotal * 0.05);
  const deliveryCharge = subtotal >= 499 ? 0 : 49;
  const total = subtotal + gst + deliveryCharge;
  const totalPaise = Math.round(total * 100);

  const handlePay = useCallback(async () => {
    if (items.length === 0 || totalPaise < 100) return;
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
        setError("Razorpay failed to load. Please try again.");
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
            onClose();
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
  }, [items.length, totalPaise, clearCart, onClose, router]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
    <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-display text-xl font-bold text-brand-red flex items-center gap-2">
                <ShoppingBag size={20} />
                Your Cart ({items.length})
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-brand-cream rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <ShoppingBag size={64} className="text-brand-sage mb-4" />
                <h3 className="font-display text-xl font-bold text-text-primary mb-2">
                  Your cart is empty
                </h3>
                <p className="text-text-muted text-sm mb-6">
                  Looks like you haven&apos;t added anything yet. Explore our
                  delicious collection!
                </p>
                <Button onClick={onClose}>Continue Shopping</Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="flex gap-3 p-3 bg-brand-cream/30 rounded-brand"
                    >
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          unoptimized={item.variantId.startsWith("custom-")}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-text-primary truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-text-muted">{item.size}</p>
                        <p className="text-brand-red font-bold mt-1">
                          ₹{item.price * item.quantity}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.quantity - 1
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center bg-white border border-brand-sage/50 rounded-md hover:border-brand-red transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.variantId,
                                item.quantity + 1
                              )
                            }
                            className="w-7 h-7 flex items-center justify-center bg-white border border-brand-sage/50 rounded-md hover:border-brand-red transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            onClick={() =>
                              removeItem(item.productId, item.variantId)
                            }
                            className="ml-auto p-1 text-text-muted hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div className="border-t p-4 space-y-3">
                  <div className="space-y-2 text-sm">
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
                      <span>
                        {deliveryCharge === 0 ? (
                          <span className="text-green-600 font-medium">FREE</span>
                        ) : (
                          `₹${deliveryCharge}`
                        )}
                      </span>
                    </div>
                    {deliveryCharge > 0 && (
                      <p className="text-xs text-brand-red">
                        Add ₹{499 - subtotal} more for free delivery
                      </p>
                    )}
                    <div className="flex justify-between font-bold text-base pt-2 border-t">
                      <span>Total</span>
                      <span className="text-brand-red">₹{total}</span>
                    </div>
                  </div>
                  {error && (
                    <p className="text-red-600 text-xs">{error}</p>
                  )}
                  <Button fullWidth size="lg" onClick={handlePay} disabled={isPaying}>
                    {isPaying ? "Opening Razorpay..." : `Pay ₹${total}`}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}
