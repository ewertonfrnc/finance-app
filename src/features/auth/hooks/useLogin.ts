import { login } from "../services/auth.service";
import { useAuthMutation } from "./useAuthMutation";

export function useLogin() {
  return useAuthMutation(login);
}
