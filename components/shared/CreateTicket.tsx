"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TicketSchema } from "@/lib/zod/ticket.schema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import DatePicker from "./registration-deadline";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { Tickets } from "@/lib/types/requests/ticketsRequests";
import UploadImage, { type UploadData } from "@/components/shared/upload-image";

interface CreateTicketProps {
  setModal: (value: boolean) => void;
  title: string;
  titleName: string;
  titleDesc: string;
  onCreate?: (data: Omit<Tickets, "id">) => void;
  onUpdate?: (data: Tickets) => void;
  initialData?: Tickets;
  isUpdate?: boolean;
}

export default function CreateTicket({
  setModal,
  title,
  titleName,
  titleDesc,
  onCreate,
  onUpdate,
  initialData,
  isUpdate = false,
}: CreateTicketProps) {
  const form = useForm<z.infer<typeof TicketSchema>>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      capacity: initialData?.capacity || 0,
      price: initialData?.price || 0,
      registrationDeadline: initialData?.registrationDeadline
        ? typeof initialData.registrationDeadline === "string"
          ? new Date(initialData.registrationDeadline)
          : initialData.registrationDeadline
        : undefined,
    },
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingData, setPendingData] = useState<z.infer<
    typeof TicketSchema
  > | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ticketThumbnailData, setTicketThumbnailData] =
    useState<UploadData | null>(null);
  const [ticketLink, setTicketLink] = useState("");
  const [isEditingTicketLink, setIsEditingTicketLink] = useState(false);
  const [tempTicketLink, setTempTicketLink] = useState("");

  // Load existing thumbnail if in update mode
  useEffect(() => {
    if (initialData?.thumbnail && isUpdate) {
      setTicketThumbnailData({
        url: initialData.thumbnail,
        key: initialData.thumbnail.split("/").pop() || "",
        bucket: "event-images",
        fileName: initialData.thumbnail.split("/").pop() || "",
        fileSize: 0,
        fileType: "image/jpeg",
      });
    }
  }, [initialData, isUpdate]);

  const handleSaveTicketLink = () => {
    setTicketLink(tempTicketLink);
    setIsEditingTicketLink(false);
    // TODO: Save to database when API is ready
    console.log("Ticket link saved:", tempTicketLink);
  };

  const handleCancelTicketLink = () => {
    setTempTicketLink(ticketLink);
    setIsEditingTicketLink(false);
  };

  const handleEditTicketLink = () => {
    setTempTicketLink(ticketLink);
    setIsEditingTicketLink(true);
  };

  const handleFormSubmit = (data: z.infer<typeof TicketSchema>) => {
    setPendingData(data);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!pendingData) return;
    setIsLoading(true);

    try {
      // Format the data properly for API
      const formattedData = {
        ...pendingData,
        // Convert date to ISO string if it exists
        registrationDeadline: pendingData.registrationDeadline
          ? new Date(pendingData.registrationDeadline).toISOString()
          : "",
        // Include thumbnail URL if uploaded
        thumbnail:
          ticketThumbnailData?.url || initialData?.thumbnail || undefined,
      };

      if (isUpdate && onUpdate) {
        // Pass id along with the data for updates
        await onUpdate({ ...formattedData, id: initialData?.id } as Tickets);
      } else if (onCreate) {
        // For create, just pass the formatted data
        await onCreate(formattedData);
      }

      setConfirmOpen(false);
      setModal(false);
      form.reset();
    } catch (error) {
      console.error("Failed to save ticket:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 w-full min-h-screen flex items-center justify-center bg-black bg-opacity-50 px-[5%] overflow-hidden">
      <Card className="w-[45rem] rounded-[1rem] p-[16px] max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-col gap-4">
          <CardTitle>
            <h1 className="text-3xl text-blue-800 font-[700] mb-4">{title}</h1>
          </CardTitle>

          {/* Ticket Link Field - Only in Update Mode */}
          {isUpdate && (
            <div className="border-b pb-4 mb-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Ticket Link
                </label>
                {!isEditingTicketLink && (
                  <button
                    onClick={handleEditTicketLink}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  value={isEditingTicketLink ? tempTicketLink : ticketLink}
                  onChange={(e) => setTempTicketLink(e.target.value)}
                  placeholder="Enter ticket link URL"
                  className="flex-1"
                  disabled={!isEditingTicketLink}
                />
                {isEditingTicketLink && (
                  <>
                    <Button
                      type="button"
                      onClick={handleSaveTicketLink}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Save
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelTicketLink}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
              {ticketLink && !isEditingTicketLink && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {ticketLink}
                </p>
              )}
            </div>
          )}
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)}>
            {/* Ticket Name */}
            <CardTitle className="flex flex-col gap-1 mb-6 px-[24px]">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-[700] !text-slate-700">
                      {titleName}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Lorem Ipsum"
                        className="border-[#94A3B8] border-2 p-5 font-[400] rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardTitle>

            {/* Description */}
            <CardTitle className="flex flex-col gap-4 mb-8 px-[24px]">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-[700] !text-slate-700">
                      {titleDesc}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="dolor sit amet..."
                        className="h-[9.5rem] border-[#94A3B8] border-2 p-5 font-[400] resize-none rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardTitle>

            {/* Capacity */}
            <CardContent className="flex gap-3 w-full">
              <div className="flex flex-col gap-3 flex-1">
                <Label className="font-[700]">Capacity</Label>
                <div className=" flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Enter capacity"
                            className="px-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <Label className="font-[700]">Price</Label>
                <div className=" flex flex-col gap-3">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter price"
                            className="px-2"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>

            {/* Registration Deadline */}
            <CardFooter className="flex flex-col gap-20">
              <div className="w-full flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="registrationDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-[700] !text-slate-700">
                        Registration Deadline
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onSelect={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Upload Ticket Thumbnail */}
              <div className="w-full flex flex-col gap-3">
                <h3 className="font-[700] !text-slate-700 text-lg">
                  Upload Ticket Thumbnail
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Your uploaded image will be what users see while viewing the
                  ticket's details.
                </p>
                <div className="text-sm text-gray-500 space-y-1 mb-4">
                  <p>Maximum file size: 10 MB</p>
                  <p>Accepted File type: png, jpg, jpeg</p>
                  <p>
                    Note: For optimal display, your image should have a 1:1
                    ratio
                  </p>
                </div>
                <UploadImage
                  uploadType="asset"
                  folder="ticket-thumbnails"
                  onUploadComplete={(uploadData) => {
                    console.log("Ticket thumbnail uploaded:", uploadData);
                    setTicketThumbnailData(uploadData);
                  }}
                  onUploadError={(error) => {
                    console.error("Ticket thumbnail upload error:", error);
                    setTicketThumbnailData(null);
                  }}
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col-reverse md:flex-row justify-end w-full">
                <Button
                  variant="ghost"
                  type="button"
                  className="px-14 py-4 rounded-[6px] text-[0.875rem] font-medium"
                  onClick={() => setModal(false)}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="bg-[#2563EB] px-14 py-4 rounded-[6px] text-[0.875rem] font-medium"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Saving..."
                    : isUpdate
                      ? "Update Ticket"
                      : "Create Ticket"}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Confirm Modal */}
      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirm}
        title={isUpdate ? "Confirm Ticket Update" : "Confirm Ticket Creation"}
        description={
          isUpdate
            ? "Are you sure you want to update this ticket?"
            : "Are you sure you want to create this ticket?"
        }
        confirmText={isUpdate ? "Yes, Update" : "Yes, Create"}
        cancelText="No, Cancel"
        isLoading={isLoading}
      />
    </div>
  );
}
