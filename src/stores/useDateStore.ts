import { addMonths, getMonth, getYear, subMonths } from "date-fns";
import { create } from "zustand";

interface DateState {
  selectedYear: number;
  selectedMonth: number; // 1-12
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToCurrentMonth: () => void;
}

const now = new Date();

export const useDateStore = create<DateState>((set, get) => ({
  selectedYear: getYear(now),
  selectedMonth: getMonth(now) + 1, // date-fns getMonth é 0-indexed
  goToPrevMonth: () => {
    const { selectedYear, selectedMonth } = get();
    const prev = subMonths(new Date(selectedYear, selectedMonth - 1), 1);
    set({ selectedYear: getYear(prev), selectedMonth: getMonth(prev) + 1 });
  },
  goToNextMonth: () => {
    const { selectedYear, selectedMonth } = get();
    const next = addMonths(new Date(selectedYear, selectedMonth - 1), 1);
    set({ selectedYear: getYear(next), selectedMonth: getMonth(next) + 1 });
  },
  goToCurrentMonth: () => {
    const today = new Date();
    set({ selectedYear: getYear(today), selectedMonth: getMonth(today) + 1 });
  },
}));
