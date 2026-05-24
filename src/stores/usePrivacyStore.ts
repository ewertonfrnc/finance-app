import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { asyncStorage } from "@/src/lib/storage";

interface PrivacyState {
  hideValues: boolean;
  toggleHideValues: () => void;
}

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set, get) => ({
      hideValues: false,
      toggleHideValues: () => set({ hideValues: !get().hideValues }),
    }),
    {
      name: "privacy-store",
      storage: createJSONStorage(() => asyncStorage),
    },
  ),
);
