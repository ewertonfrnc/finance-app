import { useMutation } from '@tanstack/react-query';

import { updateTag } from '../services/tags.service';
import type { ApiUpdateTagPayload } from '../types';

export function useUpdateTag() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ApiUpdateTagPayload }) =>
      updateTag(id, payload),
  });
}
