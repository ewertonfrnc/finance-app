import type { ApiResponse } from "@/src/lib/types";
import { apiClient } from "@/src/services/client";
import type {
  ApiAuthResponse,
  ApiAuthUser,
  ApiLoginPayload,
  ApiRegisterPayload,
  AuthResult,
  AuthUser,
} from "../types";

function mapUser(api: ApiAuthUser): AuthUser {
  return {
    id: api.id,
    name: api.name,
    email: api.email,
    initialBalance: api.initial_balance,
    onboardingDone: api.onboarding_done,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

export async function register(
  payload: ApiRegisterPayload,
): Promise<AuthResult> {
  const response = await apiClient.post<ApiResponse<ApiAuthResponse>>(
    "/v1/auth/register",
    payload,
  );
  if (!response.data.success) {
    throw new Error("Erro ao criar conta");
  }
  const { token, user } = response.data.data;
  return { token, user: mapUser(user) };
}

export async function forgotPassword(email: string): Promise<void> {
  await apiClient.post("/v1/auth/forgot-password", { email });
}

export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  await apiClient.post("/v1/auth/reset-password", { token, password });
}

export async function login(payload: ApiLoginPayload): Promise<AuthResult> {
  const response = await apiClient.post<ApiResponse<ApiAuthResponse>>(
    "/v1/auth/login",
    payload,
  );
  if (!response.data.success) {
    throw new Error("Email ou senha incorretos");
  }
  const { token, user } = response.data.data;
  return { token, user: mapUser(user) };
}
