import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/src/stores/useAuthStore";
import type { AuthResult } from "../types";

export function useAuthMutation<TPayload>(
  mutationFn: (payload: TPayload) => Promise<AuthResult>,
) {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      setAuth(data.token, data.user.id);
    },
  });
}
