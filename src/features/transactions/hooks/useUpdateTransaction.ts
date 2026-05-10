import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/src/lib/queryKeys';
import type { ApiUpdateTransactionPayload } from '../types';
import { updateTransaction } from '../services/transactions.service';

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApiUpdateTransactionPayload }) =>
      updateTransaction(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionsAll() });
    },
  });
}
