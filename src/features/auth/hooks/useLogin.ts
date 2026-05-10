import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/src/stores/useAuthStore";
import { login } from "../services/auth.service";
import type { ApiLoginPayload } from "../types";

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: ApiLoginPayload) => login(payload),
    onSuccess: (data) => {
      setAuth(data.token, data.user.id);
    },
  });
}
