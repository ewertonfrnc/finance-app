import { register } from "../services/auth.service";
import { useAuthMutation } from "./useAuthMutation";

export function useRegister() {
  return useAuthMutation(register);
}
