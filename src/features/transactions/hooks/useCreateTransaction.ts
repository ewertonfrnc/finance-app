import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/src/lib/queryKeys';
import type { ApiCreateTransactionPayload } from '../types';
import { createTransaction } from '../services/transactions.service';

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApiCreateTransactionPayload) => createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactionsAll() });
    },
  });
}
