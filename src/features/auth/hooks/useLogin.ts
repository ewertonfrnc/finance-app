import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/src/stores/useAuthStore";
import { login } from "../services/auth.service";
import type { ApiLoginPayload } from "../types";

export function useLogin() {
  const setToken = useAuthStore((s) => s.setToken);

  return useMutation({
    mutationFn: (payload: ApiLoginPayload) => login(payload),
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
}
