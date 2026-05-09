import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { asyncStorage } from '@/src/lib/storage';

interface SettingsState {
  initialBalance: number; // saldo de abertura do mês, em centavos
  setInitialBalance: (amount: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      initialBalance: 0,
      setInitialBalance: (amount) => set({ initialBalance: amount }),
    }),
    {
      name: 'settings-store',
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
