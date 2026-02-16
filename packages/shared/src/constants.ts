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
