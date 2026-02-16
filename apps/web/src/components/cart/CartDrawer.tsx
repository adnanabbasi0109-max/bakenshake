"use client";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Button from "@/components/ui/Button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const gst = Math.round(subtotal * 0.05);
  const deliveryCharge = subtotal >= 499 ? 0 : 49;
  const total = subtotal + gst + deliveryCharge;

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
                  <Button href="/checkout" fullWidth size="lg">
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
