import { useQueryClient } from "@tanstack/react-query";
import { addMonths, getMonth, getYear } from "date-fns";
import { useEffect } from "react";

import { useAuthStore } from "@/src/stores/useAuthStore";

import { balanceQueryOptions } from "./useBalanceQuery";

export function usePrefetchAdjacentBalances(year: number, month: number) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  useEffect(() => {
    if (!userId) return;

    const current = new Date(year, month - 1);
    for (const offset of [-2, -1, 1, 2]) {
      const d = addMonths(current, offset);
      queryClient.prefetchQuery(
        balanceQueryOptions(userId, getYear(d), getMonth(d) + 1),
      );
    }
  }, [userId, year, month, queryClient]);
}
