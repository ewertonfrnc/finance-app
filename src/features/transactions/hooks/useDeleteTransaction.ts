import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { deleteTransaction } from "../services/transactions.service";

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.transactionsAll(userId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.balanceAll(userId),
        }),
      ]);
    },
  });
}
