/** Tipos usados internamente pelo app — campos normalizados em camelCase. */

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initialBalance: number;
  onboardingDone: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}
