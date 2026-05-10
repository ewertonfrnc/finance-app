import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/src/lib/queryKeys';
import { getTransaction } from '../services/transactions.service';

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => getTransaction(id),
    enabled: !!id,
  });
}
