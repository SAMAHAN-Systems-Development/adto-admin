import { z } from "zod";

export const OrganizationSchema = z.object({
  name: z.string().min(1, "This is a required field"),
  acronym: z.string().min(1, "This is a required field"),
  email: z.string().min(1, "This is a required field").email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  organizationParentId: z.string().min(1, "This is a required field"),
  description: z.string().optional(),
  facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type OrganizationSchema = z.infer<typeof OrganizationSchema>;