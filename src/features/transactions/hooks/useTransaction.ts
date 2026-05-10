import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { getTransaction } from "../services/transactions.service";

export function useTransaction(id: string) {
  const userId = useAuthStore((s) => s.userId);

  return useQuery({
    queryKey: queryKeys.transaction(userId, id),
    queryFn: () => getTransaction(id),
    enabled: !!userId && !!id,
  });
}
