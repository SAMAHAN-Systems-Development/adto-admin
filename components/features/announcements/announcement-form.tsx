"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { announcementFormSchema } from "@/lib/zod/announcement.schema";
import type { AnnouncementFormRequest } from "@/lib/types/requests/AnnouncementRequests";

interface AnnouncementFormProps {
  onSubmit: (data: AnnouncementFormRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onFormChange?: () => void;
  initialData?: AnnouncementFormRequest;
  isEditMode?: boolean;
}

export function AnnouncementForm({
  onSubmit,
  onCancel,
  isLoading = false,
  onFormChange,
  initialData,
  isEditMode = false,
}: AnnouncementFormProps) {
  const form = useForm<AnnouncementFormRequest>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: initialData || {
      title: "",
      content: "",
    },
  });

  async function handleSubmit(data: AnnouncementFormRequest) {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Failed to create announcement:", error);
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
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Announcement Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter announcement title"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange();
                    }}
                    disabled={isLoading}
                    // Position cursor at end of text when focused (for edit mode)
                    onFocus={(e) => {
                      const val = e.target.value;
                      setTimeout(() => {
                        e.target.setSelectionRange(val.length, val.length);
                      }, 0);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Type */}
          <FormField
            control={form.control}
            name="announcementType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Announcement Type</FormLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFieldChange();
                  }}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select announcement type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="INFO">Info</SelectItem>
                    <SelectItem value="WARNING">Warning</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Brief description of announcement"
                    className="min-h-[120px]"
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange();
                    }}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isLoading}
            className="text-gray-900 hover:bg-gray-100 px-5"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5"
          >
            {isLoading
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
                ? "Update Announcement"
                : "Create Announcement"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
