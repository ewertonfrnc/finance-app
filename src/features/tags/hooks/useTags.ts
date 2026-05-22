import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/src/lib/queryKeys';
import { useAuthStore } from '@/src/stores/useAuthStore';
import { getTagsWithTotals } from '../services/tags.service';

export function useTags(year: number, month: number) {
  const userId = useAuthStore((s) => s.userId);

  return useQuery({
    queryKey: queryKeys.tags(userId, year, month),
    queryFn: () => getTagsWithTotals(year, month),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
