import * as z from "zod";
import type { AdminLoginRequest } from "../types/requests/AdminLoginRequest";

export const loginSchema: z.ZodSchema<AdminLoginRequest> = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});