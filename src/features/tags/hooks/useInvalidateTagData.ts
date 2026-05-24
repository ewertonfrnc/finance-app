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
      queryClient.refetchQueries({
        predicate: (q) => {
          const key = q.queryKey;
          return (
            key[0] === "tags" &&
            key[1] === (userId ?? "anonymous") &&
            !key.includes("transactions")
          );
        },
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.transactionsAll(userId),
        predicate: (q) => !q.queryKey.includes("detail"),
      }),
    ]);
  };
}
