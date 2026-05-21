import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";

export function useInvalidateTransactionData() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactionsAll(userId),
        predicate: (query) => !query.queryKey.includes("detail"),
      }),
      queryClient.invalidateQueries({ queryKey: queryKeys.balanceAll(userId) }),
    ]);
}
