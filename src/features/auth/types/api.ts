/** Tipos que espelham exatamente o contrato do backend Go. Não usar diretamente nas telas. */

export interface ApiRegisterPayload {
  name: string;
  email: string;
  password: string;
  initialBalance: number; // centavos
  daysPerMonth: number; // 28–31
  categories: {
    comida: number;
    transporte: number;
    lazer: number;
    compras: number;
    saude: number;
  };
}

export interface ApiLoginPayload {
  email: string;
  password: string;
}

export interface ApiAuthUser {
  id: string;
  name: string;
  email: string;
  initial_balance: number;
  onboarding_done: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiAuthBudgetCategory {
  id: string;
  user_id: string;
  slug: string;
  label: string;
  monthly_amount: number;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface ApiRegisterResponse {
  token: string;
  user: ApiAuthUser;
  daily_budget: number;
  categories: ApiAuthBudgetCategory[];
}

export interface ApiLoginResponse {
  token: string;
  user: ApiAuthUser;
}
