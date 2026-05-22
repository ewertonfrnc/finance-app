import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";

export function useInvalidateTagData() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.tagsAll(userId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactionsAll(userId),
        predicate: (q) => !q.queryKey.includes("detail"),
      }),
      // tags do not affect balance — do NOT invalidate balanceAll here
    ]);
}
