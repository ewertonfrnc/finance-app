import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/src/stores/useAuthStore";
import { register } from "../services/auth.service";
import type { ApiRegisterPayload } from "../types";

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: ApiRegisterPayload) => register(payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user.id);
    },
  });
}
