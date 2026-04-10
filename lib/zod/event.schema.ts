import * as z from "zod";
import type {
  CreateEventRequest,
  UpdateEventRequest,
} from "../types/requests/EventRequests";

export const createEventSchema: z.ZodSchema<CreateEventRequest> = z
  .object({
    name: z.string().min(1, "Provide an event name."),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters.")
      .max(5000, "Description cannot exceed 5000 characters."),
    venue: z.string().optional(),
    dateStart: z.string().datetime("Provide a start date."),
    dateEnd: z.string().datetime("Provide an end date."),
    isRegistrationOpen: z.boolean().optional(),
    isRegistrationRequired: z.boolean().optional(),
    isOpenToOutsiders: z.boolean().optional(),
  })
  .superRefine((arg, ctx) => {
    if (new Date(arg.dateStart) < new Date()) {
      ctx.addIssue({
        path: ["dateStart"],
        code: "custom",
        message: "Start date/time cannot be in the past.",
      });
    }

    if (new Date(arg.dateStart) >= new Date(arg.dateEnd)) {
      ctx.addIssue({
        path: ["dateEnd"],
        code: "custom",
        message: "End date/time must be after start date/time.",
      });
    }
  });

export const updateEventSchema: z.ZodSchema<UpdateEventRequest> = z
  .object({
    name: z
      .string()
      .min(1, "Event name cannot be empty if provided.")
      .optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters.")
      .max(5000, "Description cannot exceed 5000 characters.")
      .optional(),
    venue: z.string().optional(),
    dateStart: z.string().datetime("Provide a start date.").optional(),
    dateEnd: z.string().datetime("Provide an end date.").optional(),
    isRegistrationOpen: z.boolean().optional(),
    isRegistrationRequired: z.boolean().optional(),
    isOpenToOutsiders: z.boolean().optional(),
  })
  .superRefine((arg, ctx) => {
    if (
      arg.dateStart &&
      arg.dateEnd &&
      new Date(arg.dateStart) >= new Date(arg.dateEnd)
    ) {
      ctx.addIssue({
        path: ["dateEnd"],
        code: "custom",
        message: "End date/time must be after start date/time.",
      });
    }
  });
