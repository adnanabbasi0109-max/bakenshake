const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

async function fetchAPI<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...init } = options;

  let url = `${API_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) url += `?${qs}`;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };

  // Add auth token if available (client-side only)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...init,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Product APIs
export const productAPI = {
  getAll: (params?: Record<string, string | number | boolean | undefined>) =>
    fetchAPI("/products", { params, next: { revalidate: 60 } }),

  getFeatured: (city?: string) =>
    fetchAPI("/products/featured", { params: { city: city || "" }, next: { revalidate: 60 } }),

  getBySlug: (slug: string) =>
    fetchAPI(`/products/${slug}`, { next: { revalidate: 60 } }),

  search: (q: string, city?: string) =>
    fetchAPI("/products/search", { params: { q, city: city || "" } }),
};

// Category APIs
export const categoryAPI = {
  getAll: () =>
    fetchAPI("/categories", { next: { revalidate: 300 } }),

  getBySlug: (slug: string) =>
    fetchAPI(`/categories/${slug}`, { next: { revalidate: 300 } }),

  getProducts: (slug: string, params?: Record<string, string | number | boolean | undefined>) =>
    fetchAPI(`/categories/${slug}/products`, { params, next: { revalidate: 60 } }),
};

// Delivery APIs
export const deliveryAPI = {
  checkPincode: (pincode: string) =>
    fetchAPI("/delivery/check-pincode", {
      method: "POST",
      body: JSON.stringify({ pincode }),
    }),

  getSlots: (city: string, date?: string) =>
    fetchAPI("/delivery/slots", { params: { city, date: date || "" } }),
};

// Auth APIs
export const authAPI = {
  sendOtp: (phone: string) =>
    fetchAPI("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),

  verifyOtp: (phone: string, otp: string) =>
    fetchAPI("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    }),

  getMe: () => fetchAPI("/auth/me"),
};

// Custom Cake APIs
export const customCakeAPI = {
  generatePreview: (specifications: Record<string, unknown>) =>
    fetchAPI<{
      success: boolean;
      data: { imageUrl: string; prompt: string; pricing: Record<string, number> };
    }>("/custom-cakes/generate-preview", {
      method: "POST",
      body: JSON.stringify({ specifications }),
    }),

  calculatePrice: (specifications: Record<string, unknown>) =>
    fetchAPI<{ success: boolean; data: Record<string, number> }>(
      "/custom-cakes/calculate-price",
      {
        method: "POST",
        body: JSON.stringify({ specifications }),
      }
    ),

  create: (data: {
    specifications: Record<string, unknown>;
    aiPreviewImageUrl?: string;
    customerNotes?: string;
  }) =>
    fetchAPI("/custom-cakes/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getOrder: (id: string) => fetchAPI(`/custom-cakes/${id}`),

  getMyOrders: () =>
    fetchAPI<{
      success: boolean;
      data: Array<{
        _id: string;
        specifications: {
          shape: string;
          size: string;
          flavor: string;
          frostingType: string;
          frostingColor: string;
          filling: string;
          toppings: string[];
          theme: string;
          message: string;
          eggPreference: string;
        };
        aiPreviewImageUrl?: string;
        calculatedPrice: number;
        status: string;
        customerNotes?: string;
        createdAt: string;
        updatedAt: string;
      }>;
    }>("/custom-cakes/my-orders"),
};

// Payment (Razorpay) APIs
export const paymentAPI = {
  createOrder: (amountPaise: number) =>
    fetchAPI<{ success: boolean; orderId: string; keyId: string }>(
      "/payment/create-order",
      { method: "POST", body: JSON.stringify({ amount: amountPaise }) }
    ),

  verify: (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    fetchAPI<{ success: boolean; message?: string }>("/payment/verify", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Subscription Plan APIs
export const subscriptionPlanAPI = {
  getAll: (params?: Record<string, string | number | boolean | undefined>) =>
    fetchAPI("/subscription-plans", { params, next: { revalidate: 60 } }),

  getFeatured: () =>
    fetchAPI("/subscription-plans/featured", { next: { revalidate: 60 } }),

  getBySlug: (slug: string) =>
    fetchAPI(`/subscription-plans/${slug}`, { next: { revalidate: 60 } }),

  getSwapOptions: (slug: string, productId: string) =>
    fetchAPI(`/subscription-plans/${slug}/swap-options`, {
      params: { productId },
    }),

  create: (data: Record<string, unknown>) =>
    fetchAPI("/subscription-plans", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    fetchAPI(`/subscription-plans/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Subscription APIs
export const subscriptionAPI = {
  create: (data: Record<string, unknown>) =>
    fetchAPI<{
      success: boolean;
      data: {
        subscription: Record<string, unknown>;
        razorpaySubscriptionId?: string;
        keyId?: string;
      };
    }>("/subscriptions/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMy: () => fetchAPI("/subscriptions/my"),

  getById: (id: string) => fetchAPI(`/subscriptions/${id}`),

  pause: (id: string) =>
    fetchAPI(`/subscriptions/${id}/pause`, { method: "PUT" }),

  resume: (id: string) =>
    fetchAPI(`/subscriptions/${id}/resume`, { method: "PUT" }),

  cancel: (id: string, reason?: string) =>
    fetchAPI(`/subscriptions/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    }),

  changeFrequency: (id: string, frequency: string) =>
    fetchAPI(`/subscriptions/${id}/frequency`, {
      method: "PUT",
      body: JSON.stringify({ frequency }),
    }),

  updateAddress: (id: string, address: Record<string, unknown>) =>
    fetchAPI(`/subscriptions/${id}/address`, {
      method: "PUT",
      body: JSON.stringify(address),
    }),

  updateSlot: (
    id: string,
    day: number,
    slot: { start: string; end: string }
  ) =>
    fetchAPI(`/subscriptions/${id}/slot`, {
      method: "PUT",
      body: JSON.stringify({
        preferredDeliveryDay: day,
        preferredTimeSlot: slot,
      }),
    }),

  suggestBasket: (data: Record<string, unknown>) =>
    fetchAPI("/subscriptions/suggest-basket", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getEligibleProducts: (
    params?: Record<string, string | number | boolean | undefined>
  ) => fetchAPI("/subscriptions/eligible-products", { params }),
};

// Subscription Delivery APIs
export const subscriptionDeliveryAPI = {
  getUpcoming: () => fetchAPI("/subscription-deliveries/upcoming"),

  getById: (id: string) => fetchAPI(`/subscription-deliveries/${id}`),

  skip: (id: string, reason?: string) =>
    fetchAPI(`/subscription-deliveries/${id}/skip`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    }),

  unskip: (id: string) =>
    fetchAPI(`/subscription-deliveries/${id}/unskip`, { method: "PUT" }),

  swapItem: (
    id: string,
    oldProductId: string,
    newProductId: string,
    newVariantIndex?: number
  ) =>
    fetchAPI(`/subscription-deliveries/${id}/swap`, {
      method: "PUT",
      body: JSON.stringify({ oldProductId, newProductId, newVariantIndex }),
    }),

  payManual: (id: string) =>
    fetchAPI<{ success: boolean; orderId: string; keyId: string }>(
      `/subscription-deliveries/${id}/pay`,
      { method: "POST" }
    ),
};

export default fetchAPI;
