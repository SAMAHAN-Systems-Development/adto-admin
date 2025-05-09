import { z } from "zod";

export const orgSchema = z.object({
    name: z.string().min(2, {
        message: "Organization name must be at least 2 characters.",
    }),
    acronym: z.string().min(2, {
        message: "Acronym must be at least 2 characters.",
    }),
    icon: z.string().optional(),
    links: z
        .object({
            facebook: z.string().url().optional().or(z.literal("")),
            instagram: z.string().url().optional().or(z.literal("")),
            twitter: z.string().url().optional().or(z.literal("")),
            linkedin: z.string().url().optional().or(z.literal("")),
        })
        .optional(),
});