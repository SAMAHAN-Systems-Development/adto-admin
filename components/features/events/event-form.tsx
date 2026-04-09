"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/shared/date-time-picker";
import { Textarea } from "@/components/ui/textarea";
import { createEventSchema } from "@/lib/zod/event.schema";
import type { CreateEventRequest } from "@/lib/types/requests/EventRequests";

interface EventFormProps {
  onSubmit: (data: CreateEventRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onFormChange?: () => void;
}

export function EventForm({
  onSubmit,
  onCancel,
  isLoading = false,
  onFormChange,
}: EventFormProps) {
  const form = useForm<CreateEventRequest>({
    defaultValues: {
      name: "",
      description: "",
      venue: "",
      dateStart: "",
      dateEnd: "",
    },
    resolver: zodResolver(createEventSchema),
  });

  const selectedStartDate = form.watch("dateStart");

  const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return targetDate < today;
  };

  const disableEndDatesBeforeStart = (date: Date) => {
    if (!selectedStartDate) return false;

    const startDate = new Date(selectedStartDate);
    if (Number.isNaN(startDate.getTime())) return false;

    startDate.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return targetDate < startDate;
  };

  async function handleSubmit(data: CreateEventRequest) {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Failed to create event:", error);
    }
  }

  // Notify parent when form changes
  const handleFieldChange = () => {
    if (onFormChange) {
      onFormChange();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter event name"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter event description"
                    className="min-h-[120px]"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Venue</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter event location (Optional)"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dateStart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date & Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      {...field}
                      disabledDate={disablePastDates}
                      onChange={(value) => {
                        field.onChange(value);
                        handleFieldChange();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateEnd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date & Time</FormLabel>
                  <FormControl>
                    <DateTimePicker
                      {...field}
                      disabledDate={disableEndDatesBeforeStart}
                      onChange={(value) => {
                        field.onChange(value);
                        handleFieldChange();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
