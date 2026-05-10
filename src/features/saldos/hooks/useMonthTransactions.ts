import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { getMonthTransactions } from "../data";

export function useMonthTransactions(year: number, month: number) {
  const userId = useAuthStore((s) => s.userId);

  return useQuery({
    queryKey: queryKeys.transactions(userId, year, month),
    queryFn: () => getMonthTransactions(year, month),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
