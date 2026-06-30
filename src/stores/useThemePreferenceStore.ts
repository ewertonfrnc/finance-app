import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { asyncStorage } from "@/src/lib/storage";

export type ThemePreference = "system" | "light" | "dark";

interface ThemePreferenceState {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

export const useThemePreferenceStore = create<ThemePreferenceState>()(
  persist(
    (set) => ({
      preference: "system",
      setPreference: (preference) => set({ preference }),
    }),
    {
      name: "theme-preference-store",
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);

export function useThemePreferenceHydration() {
  const [hasHydrated, setHasHydrated] = useState(
    useThemePreferenceStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubscribe = useThemePreferenceStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    setHasHydrated(useThemePreferenceStore.persist.hasHydrated());

    return unsubscribe;
  }, []);

  return hasHydrated;
}
