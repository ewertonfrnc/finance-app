import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/src/lib/queryKeys';
import { deleteTransaction } from '../services/transactions.service';

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionsAll() });
    },
  });
}
