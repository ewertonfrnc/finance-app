import { useFocusEffect } from "expo-router";
import type { Dispatch, SetStateAction } from "react";
import { useCallback } from "react";

import { useTagPickerStore } from "@/src/stores/useTagPickerStore";

export function useTagPickerSync(
  initialized: { current: boolean },
  setTagIds: Dispatch<SetStateAction<string[]>>,
) {
  useFocusEffect(
    useCallback(() => {
      if (!initialized.current) return;
      const next = useTagPickerStore.getState().pendingTagIds;
      setTagIds((prev) =>
        prev.length === next.length && prev.every((id, i) => id === next[i])
          ? prev
          : next,
      );
    }, [initialized, setTagIds]),
  );
}
