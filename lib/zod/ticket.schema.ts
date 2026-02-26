import { z } from "zod";

export const TicketSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  description: z.string()
  .min(1, "Description is required")
  .max(90, "Description cannot exceed 90 characters"),
  capacity: z.coerce
    .number()
    .positive("Capacity must be positive")
    .min(1, "Capacity is required"),
  price: z.coerce.number(),
  registrationDeadline: z
    .date({
      required_error: "Registration deadline is required",
    })
    .min(new Date(), {
      message: "Date cannot be in the past",
    }),
});

export type TicketSchema = z.infer<typeof TicketSchema>;
