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
};

export default fetchAPI;
