import { create } from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://127.0.0.1:8080";

export const apiClient = create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    // TODO: substituir pelo token do useAuthStore quando auth estiver implementada
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_API_TOKEN ?? ""}`,
  },
});

// Traduz erros HTTP para mensagens legíveis
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const msg =
        error.response.data?.message ?? `Erro ${error.response.status}`;
      return Promise.reject(new Error(msg));
    }
    if (error.request) {
      return Promise.reject(new Error("Servidor indisponível"));
    }
    return Promise.reject(error);
  },
);
