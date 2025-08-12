import axios from "axios";
import { User } from "../types/User";

// ---------- Axios Client ----------
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "http://localhost:5000",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---------- Types ----------
export interface AuthResponse {
  token: string;
  user: User;
}

// ---------- Auth API ----------
export const authApi = {
  login: (email: string, password: string) =>
    axiosClient.post<AuthResponse>("/auth/login", { email, password }),

  signup: (
    name: string,
    email: string,
    password: string,
    role: "guest" | "host"
  ) =>
    axiosClient.post<AuthResponse>("/auth/signup", {
      name,
      email,
      password,
      role,
    }),
};

// ---------- Bookings API ----------
export const bookingApi = {
  createBooking: (data: any) => axiosClient.post("/bookings", data),
  getBookings: () => axiosClient.get("/bookings"),
  cancelBooking: (id: string) => axiosClient.delete(`/bookings/${id}`),
};

// ---------- Properties API ----------
export const propertyApi = {
  getAll: (params: any) => axiosClient.get("/properties", { params }),
  create: (data: any) => axiosClient.post("/properties", data),
  getById: (id: string) => axiosClient.get(`/properties/${id}`),
  update: (id: string | undefined, data: any) =>
    axiosClient.put(`/properties/${id}`, data),
};

// ---------- Host API ----------
export const hostApi = {
  getProperties: () => axiosClient.get("/properties/host"),
  getAnalytics: () => axiosClient.get("/properties/host/analytics"),
  deleteProperty: (id: string) => axiosClient.delete(`/properties/${id}`),
};

// ---------- Reviews API ----------
export const reviewApi = {
  addReview: (propertyId: string, data: any) =>
    axiosClient.post(`/reviews/${propertyId}`, data),
  getReviews: (propertyId: string) => axiosClient.get(`/reviews/${propertyId}`),
  checkEligibility: (propertyId: string) =>
    axiosClient.get(`/reviews/eligibility/${propertyId}`),
  updateReview: (reviewId: string, data: any) =>
    axiosClient.put(`/reviews/${reviewId}`, data),
  deleteReview: (reviewId: string) =>
    axiosClient.delete(`/reviews/${reviewId}`),
};

// ---------- Upload API ----------
export const uploadApi = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    return axiosClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default {
  authApi,
  bookingApi,
  propertyApi,
  hostApi,
  reviewApi,
  uploadApi,
};
