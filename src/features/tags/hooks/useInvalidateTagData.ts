import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";

export function useInvalidateTagData() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return (deletedTagId?: string) => {
    if (deletedTagId) {
      queryClient.removeQueries({
        predicate: (q) =>
          q.queryKey.includes(deletedTagId) &&
          q.queryKey.includes("transactions"),
      });
    }

    return Promise.all([
      queryClient.invalidateQueries({
        queryKey: queryKeys.tagsAll(userId),
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactionsAll(userId),
        predicate: (q) => !q.queryKey.includes("detail"),
      }),
    ]);
  };
}
