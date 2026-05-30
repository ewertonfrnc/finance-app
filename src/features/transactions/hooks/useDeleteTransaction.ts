import { useMutation } from "@tanstack/react-query";

import { deleteTransaction } from "../services/transactions.service";
import type { ApiDeleteScopeParams } from "../types";

export function useDeleteTransaction() {
  return useMutation({
    mutationFn: ({
      id,
      params,
    }: {
      id: string;
      params?: ApiDeleteScopeParams;
    }) => deleteTransaction(id, params),
  });
}
