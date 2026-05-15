import { useMutation } from "@tanstack/react-query";

import { updateTransaction } from "../services/transactions.service";
import type { ApiUpdateTransactionPayload } from "../types";

export function useUpdateTransaction() {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ApiUpdateTransactionPayload;
    }) => updateTransaction(id, payload),
  });
}
