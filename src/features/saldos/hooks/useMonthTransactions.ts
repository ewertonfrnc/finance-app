import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/src/lib/queryKeys";
import { getMonthTransactions } from "../data";

export function useMonthTransactions(year: number, month: number) {
  return useQuery({
    queryKey: queryKeys.transactions(year, month),
    queryFn: () => getMonthTransactions(year, month),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
