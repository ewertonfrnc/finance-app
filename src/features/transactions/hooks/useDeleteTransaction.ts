import { useMutation } from "@tanstack/react-query";

import { deleteTransaction } from "../services/transactions.service";

export function useDeleteTransaction() {
  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
  });
}
