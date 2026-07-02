import { getDaysInMonth } from "date-fns";

import type { DayBalance } from "@/src/features/transactions/types/domain";
import { formatIsoDate } from "@/src/lib/date";
import { useBalanceQuery } from "./useBalanceQuery";

function buildEmptyDays(year: number, month: number): DayBalance[] {
  const total = getDaysInMonth(new Date(year, month - 1));
  return Array.from({ length: total }, (_, i) => {
    return {
      date: formatIsoDate(new Date(year, month - 1, i + 1)),
      endBalance: 0,
      totalIncome: 0,
      totalSpending: 0,
      income: 0,
      expense: 0,
      daily: 0,
      dailyProjected: 0,
      savings: 0,
    };
  });
}

export function useDailyBalances(year: number, month: number) {
  const { data, ...queryResult } = useBalanceQuery(year, month);
  return {
    data: data ?? buildEmptyDays(year, month),
    isPlaceholder: !data,
    ...queryResult,
  };
}
