import * as z from "zod";
import type { CreateEventDto } from "../types/dto/create-event.type";

export const createEventSchema: z.ZodSchema<CreateEventDto> = z
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
