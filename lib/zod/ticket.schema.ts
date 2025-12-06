import { z } from "zod";

export const TicketSchema = z
  .object({
    name: z.string().min(1, "Ticket name is required"),
    description: z.string().min(1, "Description is required"),
    capacity: z.coerce.number().positive("Capacity must be positive").min(1, "Capacity is required"),
    price: z.coerce.number().positive("Price must be positive").min(1, "Price is required"),
    registrationDeadline: z.date({
      required_error: "Registration deadline is required",
    }).min(new Date(), {
      message: "Date cannot be in the past",
    }),
  })

export type TicketSchema = z.infer<typeof TicketSchema>;
