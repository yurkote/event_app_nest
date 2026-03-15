import { useMutation } from "@tanstack/react-query";
import { AuthService } from "../services";
import type { AuthResponse, RegisterDto } from "../types";
import type { LoginDto } from "../types";
import { useAuthStore } from "../store/authStore";

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: (data: RegisterDto) =>
      AuthService.register(data).then((res) => res.data),
    onSuccess: (data: AuthResponse) => setAuth(data.token, data.user),
  });
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  return useMutation({
    mutationFn: (data: LoginDto) =>
      AuthService.login(data).then((res) => res.data),
    onSuccess: (data: AuthResponse) => setAuth(data.token, data.user),
  });
};
