import { useMutation } from "@tanstack/react-query";

import { setTransactionTags } from "../services/tags.service";

export function useSetTransactionTags() {
  return useMutation({
    mutationFn: ({
      transactionId,
      tagIds,
    }: {
      transactionId: string;
      tagIds: string[];
    }) => setTransactionTags(transactionId, tagIds),
  });
}
