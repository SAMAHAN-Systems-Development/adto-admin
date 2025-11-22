import * as z from "zod";

export const createAnnouncementSchema = z.object({
  eventId: z.string().min(1, "Event ID is required."),
  announcementType: z.enum(["INFO", "WARNING", "CANCELLED"], {
    errorMap: () => ({ message: "Please select a valid announcement type." }),
  }),
  title: z
    .string()
    .min(1, "Title is required.")
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title must not exceed 100 characters."),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters.")
    .max(5000, "Content must not exceed 5000 characters."),
});

// Form schema - only form fields (no eventId)
export const announcementFormSchema = z.object({
  announcementType: z.enum(["INFO", "WARNING", "CANCELLED"], {
    errorMap: () => ({ message: "Please select a valid announcement type." }),
  }),
  title: z
    .string()
    .min(1, "Title is required.")
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title must not exceed 100 characters."),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters.")
    .max(5000, "Content must not exceed 5000 characters."),
});

export const updateAnnouncementSchema = z.object({
  announcementType: z
    .enum(["INFO", "WARNING", "CANCELLED"], {
      errorMap: () => ({
        message: "Please select a valid announcement type.",
      }),
    })
    .optional(),
  title: z
    .string()
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title must not exceed 100 characters.")
    .optional(),
  content: z
    .string()
    .min(10, "Content must be at least 10 characters.")
    .max(5000, "Content must not exceed 5000 characters.")
    .optional(),
});
