import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { asyncStorage } from "@/src/lib/storage";

interface AuthState {
  token: string | null;
  userId: string | null;
  setAuth: (token: string | null, userId: string | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userId: null,
      setAuth: (token, userId) => set({ token, userId }),
      clearAuth: () => set({ token: null, userId: null }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
