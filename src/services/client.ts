import { create } from "axios";

import { useAuthStore } from "@/src/stores/useAuthStore";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://127.0.0.1:8080";

export const apiClient = create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const msg = error.response.data?.error ?? `Erro ${error.response.status}`;
      return Promise.reject(new Error(msg));
    }
    if (error.request) {
      return Promise.reject(new Error("Servidor indisponível"));
    }
    return Promise.reject(error);
  },
);
