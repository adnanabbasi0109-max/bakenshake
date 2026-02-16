export const CITIES = ['Bhopal', 'Indore', 'Gwalior'] as const;

export const DIETARY_TAGS = {
  veg: { label: 'Veg', color: '#22C55E', icon: '●' },
  eggless: { label: 'Eggless', color: '#22C55E', icon: '●' },
  'contains-egg': { label: 'Contains Egg', color: '#EF4444', icon: '●' },
  'non-veg': { label: 'Non-Veg', color: '#EF4444', icon: '●' },
} as const;

export const ORDER_STATUSES = {
  placed: { label: 'Order Placed', step: 1 },
  confirmed: { label: 'Order Confirmed', step: 2 },
  preparing: { label: 'Being Prepared', step: 3 },
  out_for_delivery: { label: 'Out for Delivery', step: 4 },
  delivered: { label: 'Delivered', step: 5 },
  cancelled: { label: 'Cancelled', step: -1 },
} as const;

export const GST_RATE = 0.05; // 5% for food items

export const BRAND_COLORS = {
  red: '#A8384C',
  redDark: '#8A2E3E',
  redLight: '#C45A6E',
  sage: '#C5D4C0',
  sageDark: '#A8B9A3',
  sageLight: '#D8E4D4',
  lavender: '#9E8EA8',
  lavenderLight: '#B8ABC0',
  blush: '#E8BFC0',
  cream: '#F0E6D8',
  brown: '#6B4C3B',
  textPrimary: '#2D2D2D',
  textSecondary: '#5A5A5A',
  textMuted: '#8A8A8A',
  white: '#FFFFFF',
} as const;

// ============ Subscription Constants ============
export const SUBSCRIPTION_LANES = {
  FRESH_CITY_ONLY: { label: 'Fresh Local Delivery', description: 'Delivered fresh in Bhopal, Indore & Gwalior' },
  SHELF_STABLE_NATIONAL: { label: 'Pan-India Shipping', description: 'Shelf-stable items shipped across India' },
} as const;

export const SUBSCRIPTION_FREQUENCIES = {
  weekly: { label: 'Weekly', daysInterval: 7 },
  biweekly: { label: 'Every 2 Weeks', daysInterval: 14 },
  monthly: { label: 'Monthly', daysInterval: 30 },
} as const;

export const SUBSCRIPTION_STATUSES = {
  active: { label: 'Active', color: '#22C55E' },
  paused: { label: 'Paused', color: '#F59E0B' },
  cancelled: { label: 'Cancelled', color: '#EF4444' },
  payment_failed: { label: 'Payment Failed', color: '#EF4444' },
  pending_setup: { label: 'Setup Pending', color: '#8B5CF6' },
} as const;

export const DELIVERY_INSTANCE_STATUSES = {
  upcoming: { label: 'Upcoming', color: '#3B82F6' },
  locked: { label: 'Locked', color: '#6B7280' },
  payment_pending: { label: 'Payment Pending', color: '#F59E0B' },
  payment_failed: { label: 'Payment Failed', color: '#EF4444' },
  paid: { label: 'Confirmed', color: '#22C55E' },
  preparing: { label: 'Being Prepared', color: '#8B5CF6' },
  out_for_delivery: { label: 'Out for Delivery', color: '#F97316' },
  delivered: { label: 'Delivered', color: '#22C55E' },
  skipped: { label: 'Skipped', color: '#6B7280' },
  cancelled: { label: 'Cancelled', color: '#EF4444' },
} as const;

export const NUTRITION_TAGS = {
  high_protein: { label: 'High Protein', color: '#DC2626' },
  low_sugar: { label: 'Low Sugar', color: '#059669' },
  low_carb: { label: 'Low Carb', color: '#7C3AED' },
  high_fiber: { label: 'High Fiber', color: '#D97706' },
  keto_friendly: { label: 'Keto', color: '#2563EB' },
  gluten_free: { label: 'Gluten Free', color: '#16A34A' },
  sugar_free: { label: 'Sugar Free', color: '#0891B2' },
  whole_grain: { label: 'Whole Grain', color: '#92400E' },
  low_calorie: { label: 'Low Calorie', color: '#E11D48' },
  vegan: { label: 'Vegan', color: '#059669' },
  organic: { label: 'Organic', color: '#15803D' },
} as const;

export const HEALTH_GOALS = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'general_health', label: 'General Wellness' },
  { value: 'low_sugar_diet', label: 'Low Sugar Diet' },
  { value: 'high_fiber_diet', label: 'High Fiber Diet' },
] as const;

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
] as const;

export const PRICE_RANGES = [
  { label: 'Under ₹200', min: 0, max: 200 },
  { label: '₹200 - ₹500', min: 200, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: 'Above ₹2000', min: 2000, max: Infinity },
] as const;
