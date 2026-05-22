import { useMutation } from '@tanstack/react-query';

import { createTag } from '../services/tags.service';
import type { ApiCreateTagPayload } from '../types';

export function useCreateTag() {
  return useMutation({
    mutationFn: (payload: ApiCreateTagPayload) => createTag(payload),
  });
}
