import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { mmkvStorage } from '@/src/lib/storage';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      clearToken: () => set({ token: null }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
