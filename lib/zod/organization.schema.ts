import { z } from "zod";

const baseSchema = z.object({
  name: z.string().min(1, "This is a required field"),
  acronym: z.string().min(1, "This is a required field"),
  email: z.string().min(1, "This is a required field").email("Invalid email"),
  organizationParentId: z.string().min(1, "This is a required field"),
  description: z.string().optional(),
  facebook: z.string().url("Invalid URL").optional().or(z.literal("")),
  instagram: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const CreateOrganizationSchema = baseSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const UpdateOrganizationSchema = baseSchema.extend({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .or(z.literal(""))
    .optional(),
});

export const OrganizationSchema = baseSchema.extend({
  password: z.string().optional(),
});

export type OrganizationSchema = z.infer<typeof OrganizationSchema>;
export type CreateOrganizationSchema = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganizationSchema = z.infer<typeof UpdateOrganizationSchema>;