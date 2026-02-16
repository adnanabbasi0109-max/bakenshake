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
