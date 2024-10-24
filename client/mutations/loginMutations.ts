import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AdminLoginDto } from "../types/dto/admin-login.type";
import { loginAdmin } from "../services/loginService";

export const useLoginAdmin = (
  mutationOptions: UseMutationOptions<
    unknown,
    Error,
    { loginData: AdminLoginDto }
  >
) =>
  useMutation({
    mutationFn: ({ loginData }) => loginAdmin(loginData),
    ...mutationOptions,
  });