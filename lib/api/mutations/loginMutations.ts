import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AdminLoginRequest } from "@/lib/types/requests/AdminLoginRequest";
import { loginAdminUser } from "../services/loginService";
export const useLoginAdmin = (
  mutationOptions: UseMutationOptions<
    unknown,
    Error,
    { loginData: AdminLoginRequest }
  >
) =>
  useMutation({
    mutationFn: ({ loginData }) => loginAdminUser(loginData),
    ...mutationOptions,
  });
