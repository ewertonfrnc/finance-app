import { useQuery } from "@tanstack/react-query";
import { getMonth, getYear } from "date-fns";

import { getMonthBalance } from "@/src/features/transactions/services/transactions.service";
import type { ApiDayBalance } from "@/src/features/transactions/types";
import type { DayBalance } from "@/src/features/transactions/types/domain";
import { formatIsoDate } from "@/src/lib/date";
import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";

function mapApiDayBalance(
  year: number,
  month: number,
  api: ApiDayBalance,
): DayBalance {
  return {
    date: formatIsoDate(new Date(year, month - 1, api.day)),
    endBalance: api.running_balance,
    totalIncome: api.income,
    totalSpending: api.expense + api.daily + api.savings,
    income: api.income,
    expense: api.expense,
    daily: api.daily,
    dailyProjected: api.daily_projected,
    savings: api.savings,
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
      return raw.map((api) => mapApiDayBalance(year, month, api));
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
