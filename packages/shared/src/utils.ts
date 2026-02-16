import { GST_RATE } from './constants';

export const formatPrice = (price: number): string => {
  return `₹${price.toLocaleString('en-IN')}`;
};

export const calculateGST = (amount: number): number => {
  return Math.round(amount * GST_RATE);
};

export const calculateTotal = (subtotal: number, deliveryCharge: number, discount: number = 0): {
  subtotal: number;
  gst: number;
  deliveryCharge: number;
  discount: number;
  total: number;
} => {
  const taxableAmount = subtotal - discount;
  const gst = calculateGST(taxableAmount);
  const total = taxableAmount + gst + deliveryCharge;
  return { subtotal, gst, deliveryCharge, discount, total: Math.max(0, total) };
};

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
};

// ============ Subscription Helpers ============
export const getSubscriptionPrice = (
  plan: { priceWeekly?: number; priceBiweekly?: number; priceMonthly?: number },
  frequency: 'weekly' | 'biweekly' | 'monthly'
): number => {
  if (frequency === 'weekly') return plan.priceWeekly || 0;
  if (frequency === 'biweekly') return plan.priceBiweekly || 0;
  return plan.priceMonthly || 0;
};

export const isBeforeCutoff = (cutoffDate: string | Date): boolean => {
  return new Date() < new Date(cutoffDate);
};

export const getDeliveryStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    upcoming: 'Upcoming',
    locked: 'Locked',
    payment_pending: 'Payment Pending',
    payment_failed: 'Payment Failed',
    paid: 'Confirmed',
    preparing: 'Being Prepared',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    skipped: 'Skipped',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
};

export const getDiscountPercentage = (price: number, compareAtPrice?: number): number | null => {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
};
