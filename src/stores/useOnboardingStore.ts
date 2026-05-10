import { create } from "zustand";

export type CategorySlug =
  | "comida"
  | "transporte"
  | "lazer"
  | "compras"
  | "saude";

interface CategoryAmounts {
  comida: number;
  transporte: number;
  lazer: number;
  compras: number;
  saude: number;
}

interface OnboardingState {
  categories: CategoryAmounts;
  daysPerMonth: number;
  name: string;
  email: string;
  password: string;
  setCategory: (slug: CategorySlug, amount: number) => void;
  setDaysPerMonth: (days: number) => void;
  setCredentials: (name: string, email: string, password: string) => void;
  reset: () => void;
}

const INITIAL_STATE = {
  categories: { comida: 0, transporte: 0, lazer: 0, compras: 0, saude: 0 },
  daysPerMonth: 30,
  name: "",
  email: "",
  password: "",
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  ...INITIAL_STATE,
  setCategory: (slug, amount) =>
    set((state) => ({ categories: { ...state.categories, [slug]: amount } })),
  setDaysPerMonth: (days) => set({ daysPerMonth: days }),
  setCredentials: (name, email, password) => set({ name, email, password }),
  reset: () => set(INITIAL_STATE),
}));
