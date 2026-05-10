import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { createTransaction } from "../services/transactions.service";
import type { ApiCreateTransactionPayload } from "../types";

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: (payload: ApiCreateTransactionPayload) =>
      createTransaction(payload),
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
