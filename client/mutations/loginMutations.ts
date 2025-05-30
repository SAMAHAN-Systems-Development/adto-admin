import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AdminLoginDto } from "../types/dto/admin-login.type";
import { login } from "../services/authService";

export const useLoginAdmin = (
  mutationOptions: UseMutationOptions<
    unknown,
    Error,
    { loginData: AdminLoginDto }
  >
) =>
  useMutation({
    mutationFn: ({ loginData }) => login(loginData),
    ...mutationOptions,
  });
