import { useMutation } from "@tanstack/react-query";

import { createTransaction } from "../services/transactions.service";
import type { ApiCreateTransactionPayload } from "../types";

export function useCreateTransaction() {
  return useMutation({
    mutationFn: (payload: ApiCreateTransactionPayload) =>
      createTransaction(payload),
  });
}
