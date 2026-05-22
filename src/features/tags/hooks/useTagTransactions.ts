import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/src/lib/queryKeys';
import { useAuthStore } from '@/src/stores/useAuthStore';
import { getTagTransactions } from '../services/tags.service';

export function useTagTransactions(tagId: string, year: number, month: number) {
  const userId = useAuthStore((s) => s.userId);

  return useQuery({
    queryKey: queryKeys.tagTransactions(userId, tagId, year, month),
    queryFn: () => getTagTransactions(tagId, year, month),
    enabled: !!userId && !!tagId,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
