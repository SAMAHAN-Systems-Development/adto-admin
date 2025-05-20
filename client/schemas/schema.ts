import { z } from "zod";

export const EditEventSchema = z.object({
  eventName: z
    .string()
    .min(1, { message: "Please input a name for the event." }),
  description: z.string().min(1, { message: "Event description is required." }),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid start date.",
  }),
  selectedStartHour: z.string().min(1, { message: "Start time is required." }),
  selectedMinute: z.string().min(1, { message: "Start time is required." }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid end date.",
  }),
  selectedEndHour: z.string().min(1, { message: "End time is required." }),
  selectedEndMinute: z.string().min(1, { message: "End time is required." }),
  isChecked: z.boolean(),
  isregistered: z.boolean(),
  isOpen: z.boolean(),
});

// Optional: TypeScript type for form values
export type EditEventFormData = z.infer<typeof EditEventSchema>;
