import { useMutation } from '@tanstack/react-query';

import { deleteTag } from '../services/tags.service';

export function useDeleteTag() {
  return useMutation({
    mutationFn: (id: string) => deleteTag(id),
  });
}
