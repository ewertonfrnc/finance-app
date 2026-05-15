import { useQueryClient } from "@tanstack/react-query";
import { addMonths, getMonth, getYear, subMonths } from "date-fns";
import { useEffect } from "react";

import { useAuthStore } from "@/src/stores/useAuthStore";

import { balanceQueryOptions } from "./useBalanceQuery";

/**
 * Prefetch dos saldos do mês anterior e seguinte para tornar a troca via swipe instantânea.
 * Combinado com o staleTime do useBalanceQuery, evita refetch em meses já visitados recentemente.
 */
export function usePrefetchAdjacentBalances(year: number, month: number) {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  useEffect(() => {
    if (!userId) return;

    const current = new Date(year, month - 1);
    const prev = subMonths(current, 1);
    const next = addMonths(current, 1);

    queryClient.prefetchQuery(
      balanceQueryOptions(userId, getYear(prev), getMonth(prev) + 1),
    );
    queryClient.prefetchQuery(
      balanceQueryOptions(userId, getYear(next), getMonth(next) + 1),
    );
  }, [userId, year, month, queryClient]);
}
