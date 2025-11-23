import { z } from "zod";

export const TicketSchema = z
  .object({
    ticket: z.string().min(1, "Ticket name is required"),
    description: z.string().min(1, "Description is required"),
    capacity: z.enum(["Unlimited", "Limited"], {
      required_error: "Please select a capacity type",
    }),
    capacityAmount: z.preprocess(
      (val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      },
      z.number().positive("Capacity must be greater than 0").optional()
    ),
    priceType: z.enum(["Free", "Paid"], {
      required_error: "Please select a price type",
    }),
    priceAmount: z.preprocess(
      (val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      },
      z.number().positive("Price must be greater than 0").optional()
    ),

    // ✅ Move registrationDeadline LAST
    registrationDeadline: z.date({
      required_error: "Registration deadline is required",
    }),
  })
  .refine(
    (data) => data.capacity === "Unlimited" || data.capacityAmount !== undefined,
    {
      message: "Capacity amount is required for Limited",
      path: ["capacityAmount"],
    }
  )
  .refine(
    (data) => data.priceType === "Free" || data.priceAmount !== undefined,
    {
      message: "Price amount is required for Paid",
      path: ["priceAmount"],
    }
  );

export type TicketSchema = z.infer<typeof TicketSchema>;
