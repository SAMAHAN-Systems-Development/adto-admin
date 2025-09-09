import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AdminLoginRequest } from "@/lib/types/requests/AdminLoginRequest";
import { loginAdminUser } from "../services/loginService";
import { AdminLoginDto } from "../types/dto/admin-login.type";
import { login } from "../services/authService";

export const useLoginAdmin = (
  mutationOptions: UseMutationOptions<
    unknown,
    Error,
    { loginData: AdminLoginRequest }
  >
) =>
  useMutation({
    mutationFn: ({ loginData }) => login(loginData),
    ...mutationOptions,
  });
