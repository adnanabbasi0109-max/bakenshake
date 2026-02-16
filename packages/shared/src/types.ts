// ============ Product Types ============
export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  _id?: string;
  size: string;
  weight: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inStock: boolean;
}

export type DietaryTag = 'veg' | 'eggless' | 'contains-egg' | 'non-veg';
export type City = 'Bhopal' | 'Indore' | 'Gwalior';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category: Category | string;
  subCategory?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  dietaryTags: DietaryTag[];
  isShippable: boolean;
  availableInCities: City[];
  shelfLife?: string;
  ingredients?: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  ratings: {
    average: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

// ============ Category Types ============
export interface Category {
  _id: string;
  name: string;
  slug: string;
  parentCategory?: Category | string | null;
  description?: string;
  image?: string;
  bannerImage?: string;
  sortOrder: number;
  isActive: boolean;
  isLocalOnly: boolean;
  children?: Category[];
}

// ============ User Types ============
export interface Address {
  _id?: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  lat?: number;
  lng?: number;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  authProvider: 'phone' | 'email' | 'google';
  avatar?: string;
  addresses: Address[];
  role: 'customer' | 'admin' | 'delivery';
  loyaltyPoints: number;
  referralCode?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ Cart Types ============
export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  size: string;
  price: number;
  quantity: number;
  dietaryTags: DietaryTag[];
}

export interface Cart {
  items: CartItem[];
  couponCode?: string;
  couponDiscount: number;
  subtotal: number;
  deliveryCharge: number;
  taxAmount: number;
  total: number;
}

// ============ Order Types ============
export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  _id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  deliveryAddress: Address;
  deliveryType: 'local' | 'shipping';
  deliverySlot?: {
    date: string;
    timeRange: string;
  };
  subtotal: number;
  deliveryCharge: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingUpdates: {
    status: string;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

// ============ Delivery Types ============
export interface DeliverySlot {
  date: string;
  dayName: string;
  timeRanges: { start: string; end: string }[];
}

export interface DeliveryZone {
  _id: string;
  city: string;
  pincodes: string[];
  deliveryCharges: {
    freeAbove: number;
    baseCharge: number;
    perKmCharge: number;
  };
  deliverySlots: DeliverySlot[];
  isActive: boolean;
}

// ============ Subscription Types ============
export type SubscriptionLane = 'FRESH_CITY_ONLY' | 'SHELF_STABLE_NATIONAL';
export type SubscriptionFrequency = 'weekly' | 'biweekly' | 'monthly';
export type SubscriptionType = 'curated_plan' | 'build_your_own' | 'single_product';
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'payment_failed' | 'pending_setup';
export type DeliveryInstanceStatus =
  | 'upcoming'
  | 'locked'
  | 'payment_pending'
  | 'payment_failed'
  | 'paid'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'skipped'
  | 'cancelled';

export type NutritionTag =
  | 'high_protein'
  | 'low_sugar'
  | 'low_carb'
  | 'high_fiber'
  | 'keto_friendly'
  | 'gluten_free'
  | 'sugar_free'
  | 'whole_grain'
  | 'low_calorie'
  | 'vegan'
  | 'organic';

export type HealthGoal =
  | 'weight_loss'
  | 'muscle_gain'
  | 'general_health'
  | 'low_sugar_diet'
  | 'high_fiber_diet';

export interface SwapRules {
  requiredTags: string[];
  mustMatchShelfLifeType: boolean;
  maxSwapsPerCycle: number;
}

export interface SubscriptionPlanItem {
  product: Product | string;
  variantIndex: number;
  quantity: number;
  isSwappable: boolean;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  image?: string;
  bannerImage?: string;
  planType: 'curated' | 'build_your_own';
  lane: SubscriptionLane;
  items: SubscriptionPlanItem[];
  priceWeekly?: number;
  priceBiweekly?: number;
  priceMonthly?: number;
  compareAtPriceMonthly?: number;
  allowedFrequencies: SubscriptionFrequency[];
  swapRules?: SwapRules;
  cutoffHoursBeforeDelivery: number;
  availableInCities: City[];
  isPanIndia: boolean;
  targetNutritionTags: NutritionTag[];
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  subscriberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionItem {
  product: Product | string;
  variantIndex: number;
  quantity: number;
  unitPrice: number;
  isSwapped: boolean;
  originalProduct?: Product | string;
}

export interface Subscription {
  _id: string;
  user: User | string;
  subscriptionType: SubscriptionType;
  plan?: SubscriptionPlan | string;
  lane: SubscriptionLane;
  items: SubscriptionItem[];
  frequency: SubscriptionFrequency;
  preferredDeliveryDay: number;
  preferredTimeSlot?: { start: string; end: string };
  nextDeliveryDate: string;
  deliveryAddress: Address;
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: SubscriptionStatus;
  pausedUntil?: string;
  cancelledAt?: string;
  cancelReason?: string;
  paymentMethod: 'razorpay_autopay' | 'manual_per_delivery';
  razorpaySubscriptionId?: string;
  totalDeliveries: number;
  skippedDeliveries: number;
  healthGoal?: string;
  dietaryExclusions?: string[];
  budgetRange?: { min: number; max: number };
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionDeliveryItem {
  product: Product | string;
  variantIndex: number;
  quantity: number;
  unitPrice: number;
  productName: string;
  productImage: string;
}

export interface SubscriptionDelivery {
  _id: string;
  subscription: Subscription | string;
  user: User | string;
  deliveryNumber: number;
  items: SubscriptionDeliveryItem[];
  scheduledDate: string;
  deliverySlot?: { start: string; end: string };
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  deliveryAddress: Address;
  status: DeliveryInstanceStatus;
  editCutoffAt: string;
  isSkipped: boolean;
  skipReason?: string;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============ API Response Types ============
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: { field: string; message: string }[];
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
  refreshToken: string;
  isNewUser?: boolean;
}
