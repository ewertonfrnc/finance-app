import { addMonths, getMonth, getYear, subMonths } from 'date-fns';
import { create } from 'zustand';

interface DateState {
  selectedYear: number;
  selectedMonth: number; // 1-12
  selectedDate: string | null; // "2026-04-12"
  setMonth: (year: number, month: number) => void;
  setSelectedDate: (date: string | null) => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
}

const now = new Date();

export const useDateStore = create<DateState>((set, get) => ({
  selectedYear: getYear(now),
  selectedMonth: getMonth(now) + 1, // date-fns getMonth é 0-indexed
  selectedDate: null,
  setMonth: (year, month) => set({ selectedYear: year, selectedMonth: month }),
  setSelectedDate: (date) => set({ selectedDate: date }),
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
}));
