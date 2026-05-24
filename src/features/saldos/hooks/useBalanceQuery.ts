import { useQuery } from "@tanstack/react-query";
import { getMonth, getYear } from "date-fns";

import { getMonthBalance } from "@/src/features/transactions/services/transactions.service";
import type { ApiDayBalance } from "@/src/features/transactions/types";
import type { DayBalance } from "@/src/features/transactions/types/domain";
import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";

function mapApiDayBalance(year: number, month: number) {
  return (api: ApiDayBalance): DayBalance => {
    const mm = String(month).padStart(2, "0");
    const dd = String(api.day).padStart(2, "0");
    return {
      date: `${year}-${mm}-${dd}`,
      endBalance: api.running_balance,
      totalIncome: api.income,
      totalSpending: api.expense + api.daily + api.savings,
      income: api.income,
      expense: api.expense,
      daily: api.daily,
      dailyProjected: api.daily_projected,
      savings: api.savings,
    };
  };
}

export function balanceQueryOptions(
  userId: string | null,
  year: number,
  month: number,
) {
  const now = new Date();
  const isCurrentMonth = year === getYear(now) && month === getMonth(now) + 1;
  return {
    queryKey: queryKeys.balance(userId, year, month),
    queryFn: async () => {
      const raw = await getMonthBalance(year, month);
      return raw.map(mapApiDayBalance(year, month));
    },
    staleTime: isCurrentMonth ? 60_000 : 10 * 60_000,
  };
}

export function useBalanceQuery(year: number, month: number) {
  const userId = useAuthStore((s) => s.userId);

  return useQuery({
    ...balanceQueryOptions(userId, year, month),
    enabled: !!userId,
  });
}
