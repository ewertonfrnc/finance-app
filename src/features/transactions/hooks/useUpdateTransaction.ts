import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { updateTransaction } from "../services/transactions.service";
import type { ApiUpdateTransactionPayload } from "../types";

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ApiUpdateTransactionPayload;
    }) => updateTransaction(id, payload),
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
