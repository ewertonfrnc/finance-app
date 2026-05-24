import { create } from "zustand";

interface TagPickerState {
  pendingTagIds: string[];
  set: (ids: string[]) => void;
  clear: () => void;
}

export const useTagPickerStore = create<TagPickerState>((set) => ({
  pendingTagIds: [],
  set: (ids) => set({ pendingTagIds: ids }),
  clear: () => set({ pendingTagIds: [] }),
}));
