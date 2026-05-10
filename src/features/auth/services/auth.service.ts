import { apiClient } from "@/src/services/client";
import type {
  ApiAuthBudgetCategory,
  ApiAuthUser,
  ApiLoginPayload,
  ApiLoginResponse,
  ApiRegisterPayload,
  ApiRegisterResponse,
  AuthBudgetCategory,
  AuthResult,
  AuthUser,
} from "../types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

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

function mapCategory(api: ApiAuthBudgetCategory): AuthBudgetCategory {
  return {
    id: api.id,
    userId: api.user_id,
    slug: api.slug,
    label: api.label,
    monthlyAmount: api.monthly_amount,
    color: api.color,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  };
}

export async function register(
  payload: ApiRegisterPayload,
): Promise<AuthResult> {
  const response = await apiClient.post<ApiResponse<ApiRegisterResponse>>(
    "/v1/auth/register",
    payload,
  );
  if (!response.data.success) {
    throw new Error("Erro ao criar conta");
  }
  const { token, user, daily_budget, categories } = response.data.data;
  return {
    token,
    user: mapUser(user),
    dailyBudget: daily_budget,
    categories: categories.map(mapCategory),
  };
}

export async function login(payload: ApiLoginPayload): Promise<AuthResult> {
  const response = await apiClient.post<ApiResponse<ApiLoginResponse>>(
    "/v1/auth/login",
    payload,
  );
  if (!response.data.success) {
    throw new Error("Email ou senha incorretos");
  }
  const { token, user } = response.data.data;
  return { token, user: mapUser(user) };
}
