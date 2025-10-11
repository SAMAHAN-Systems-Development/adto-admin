import * as z from "zod";
import type { CreateEventRequest, UpdateEventRequest } from "../types/requests/EventRequests";

export const createEventSchema: z.ZodSchema<CreateEventRequest> = z
  .object({
    name: z.string().min(1, "Provide an event name."),
    description: z.string(),
    dateStart: z.string().datetime("Provide a start date."),
    dateEnd: z.string().datetime("Provide an end date."),
    isRegistrationOpen: z.boolean().optional(),
    isRegistrationRequired: z.boolean().optional(),
    isOpenToOutsiders: z.boolean().optional(),
  })
  .superRefine((arg, ctx) => {
    if (new Date(arg.dateStart) >= new Date(arg.dateEnd)) {
      ctx.addIssue({
        path: ["dateEnd"],
        code: "custom",
        message: "End date must be after the start date.",
      });
    }
  });

export const updateEventSchema: z.ZodSchema<UpdateEventRequest> = z
  .object({
    name: z.string().min(1, "Provide an event name.").optional(),
    description: z.string().optional(),
    dateStart: z.string().datetime("Provide a valid start date.").optional(),
    dateEnd: z.string().datetime("Provide a valid end date.").optional(),
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
        message: "End date must be after the start date.",
      });
    }
  });
