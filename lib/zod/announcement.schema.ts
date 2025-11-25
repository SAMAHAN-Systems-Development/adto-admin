import * as z from "zod";

// Form schema for short announcements (used in announcement-form.tsx)
export const announcementFormSchema = z.object({
  announcementType: z.enum(["INFO", "WARNING", "CANCELLED"], {
    errorMap: () => ({ message: "Please select a type." }),
  }),
  title: z
    .string()
    .min(1, "Title cannot be empty.")
    .min(10, "Title must be at least 10 characters.")
    .max(50, "Title cannot exceed 50 characters."),
  content: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .max(500, "Description cannot exceed 500 characters."),
});
