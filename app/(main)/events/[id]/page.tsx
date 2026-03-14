"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar, MapPin, Archive, ArrowLeft, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/shared/date-time-picker";
import { useEventQuery } from "@/lib/api/queries/eventsQueries";
import {
  useUpdateEventMutation,
  useArchiveEventMutation,
  useUnarchiveEventMutation,
  usePublishEventMutation,
} from "@/lib/api/mutations/eventsMutations";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
import { updateEventSchema } from "@/lib/zod/event.schema";
import toast, { Toaster } from "react-hot-toast";
import CreateTicket from "@/components/shared/CreateTicket";
import CardTicket from "@/components/shared/CardTicket";
// ADD THESE IMPORTS FOR TICKETS
import { useEventTicketsQuery } from "@/lib/api/queries/ticketQueries";
import {
  useCreateEventTicketMutation,
  useUpdateEventTicketMutation,
  useDeleteEventTicketMutation,
} from "@/lib/api/mutations/ticketMutation";
import { AnnouncementModal } from "@/components/features/announcements/announcement-modal";
import { AnnouncementList } from "@/components/features/announcements/announcement-list";
import { Tickets } from "@/lib/types/requests/ticketsRequests";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useRegistrationsQuery } from "@/lib/api/queries/registrationQueries";
import { DataTable } from "@/components/shared/data-table";
import { createRegistrationsColumns } from "@/components/features/registrations/registration-columns";
import { useUpdateRegistration } from "@/lib/api/mutations/registrationMutation";
import { useAuthStore } from "@/lib/store/authStore";
import { UploadBannerModal } from "@/components/features/events/upload-banner-modal";
import { UploadThumbnailModal } from "@/components/features/events/upload-thumbnail-modal";
import { UploadData } from "@/components/shared/upload-image";
import { deleteAsset } from "@/lib/api/services/assetService";

interface EventDetailsPageProps {
  params: {
    id: string;
  };
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  const router = useRouter();
  const { toast: showToast } = useToast();
  const [activeTab, setActiveTab] = useState("additional-details");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isEditingEventDetails, setIsEditingEventDetails] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDateStart, setEditedDateStart] = useState("");
  const [editedDateEnd, setEditedDateEnd] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [eventDetailsErrors, setEventDetailsErrors] = useState<
    Partial<Record<"name" | "description" | "dateStart" | "dateEnd", string>>
  >({});
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [modal, setModal] = useState(false);
  const [clusterFilter, setClusterFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState("all");

  const { user } = useAuthStore();
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);

  // Store uploaded banner and thumbnail data
  const [bannerImageData, setBannerImageData] = useState<UploadData | null>(
    null,
  );
  const [thumbnailImageData, setThumbnailImageData] =
    useState<UploadData | null>(null);
  const [showBannerDeleteConfirm, setShowBannerDeleteConfirm] = useState(false);
  const [showThumbnailDeleteConfirm, setShowThumbnailDeleteConfirm] =
    useState(false);

  const eventId = params.id;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchFilter, setSearchFilter] = useState("");

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchFilter, 500);
  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data: registrationsData } = useRegistrationsQuery(eventId || "", {
    page,
    limit,
    searchFilter: debouncedSearch,
  });

  const updateRegistration = useUpdateRegistration();

  // Fetch event data
  const { data: event, isLoading, error } = useEventQuery(params.id);
  const updateEventMutation = useUpdateEventMutation();
  const archiveEventMutation = useArchiveEventMutation();
  const unarchiveEventMutation = useUnarchiveEventMutation();
  const publishEventMutation = usePublishEventMutation();

  useEffect(() => {
    if (
      !isLoading &&
      event &&
      user &&
      user.role === "ORGANIZATION" &&
      event.orgId !== user.orgId
    ) {
      router.push("/unauthorized");
    }
  }, [event, user, isLoading, router]);

  // ADD THESE: Fetch tickets and mutations
  const { data: ticketsData, isLoading: ticketsLoading } = useEventTicketsQuery(
    { eventId: params.id },
  );
  const createTicketMutation = useCreateEventTicketMutation();
  const updateTicketMutation = useUpdateEventTicketMutation();
  const deleteTicketMutation = useDeleteEventTicketMutation();

  const formatDateToIso = useCallback(
    (dateValue: string | Date | null | undefined) => {
      if (!dateValue) return "";

      const parsedDate = new Date(dateValue);
      if (Number.isNaN(parsedDate.getTime())) {
        return "";
      }

      return parsedDate.toISOString();
    },
    [],
  );

  const initializeEditFields = useCallback(
    (
      eventData:
        | {
            name: string;
            description: string;
            dateStart: string | Date;
            dateEnd: string | Date;
          }
        | undefined,
    ) => {
      if (!eventData) return;

      setEditedName(eventData.name || "");
      setEditedDescription(eventData.description || "");
      setEditedDateStart(formatDateToIso(eventData.dateStart));
      setEditedDateEnd(formatDateToIso(eventData.dateEnd));
    },
    [formatDateToIso],
  );

  // Local state for switches
  const [registrationOpen, setRegistrationOpen] = useState(
    event?.isRegistrationOpen ?? false,
  );
  const [eventVisibility, setEventVisibility] = useState(
    event?.isPublished ?? false,
  );
  const [registrationRequired, setRegistrationRequired] = useState(
    event?.isRegistrationRequired ?? true,
  );

  // Helper function to extract S3 key from Supabase URL
  const extractKeyFromUrl = (url: string): string => {
    try {
      // For Supabase URLs like: https://xyz.supabase.co/storage/v1/object/public/bucket/event-banners/file.jpg
      // We need to extract everything after "/public/bucket-name/"
      const match = url.match(/\/object\/public\/[^/]+\/(.+)$/);
      if (match) {
        return match[1]; // e.g., "event-banners/1640995200000-abc123def456.jpg"
      }
      // Fallback: just get the filename
      return url.split("/").pop() || "";
    } catch (error) {
      console.error("Error extracting key from URL:", error);
      return url.split("/").pop() || "";
    }
  };

  // Update local state when event data is loaded
  useEffect(() => {
    if (event) {
      setRegistrationOpen(event.isRegistrationOpen);
      setEventVisibility(event.isPublished);
      setRegistrationRequired(event.isRegistrationRequired);
      initializeEditFields(event);

      // Load existing banner and thumbnail from event data
      if (event.banner) {
        setBannerImageData({
          url: event.banner,
          key: extractKeyFromUrl(event.banner),
          bucket: "event-images",
          fileName: event.banner.split("/").pop() || "",
          fileSize: 0,
          fileType: "image/jpeg",
        });
      }
      if (event.thumbnail) {
        setThumbnailImageData({
          url: event.thumbnail,
          key: extractKeyFromUrl(event.thumbnail),
          bucket: "event-images",
          fileName: event.thumbnail.split("/").pop() || "",
          fileSize: 0,
          fileType: "image/jpeg",
        });
      }
    }
  }, [event, initializeEditFields]);

  const tickets = ticketsData?.data || [];

  const handleRegistrationOpenChange = async (checked: boolean) => {
    setRegistrationOpen(checked);
    await updateEventMutation.mutateAsync({
      id: params.id,
      data: { isRegistrationOpen: checked },
    });
  };

  const handleEventVisibilityChange = async (checked: boolean) => {
    setEventVisibility(checked);
    await updateEventMutation.mutateAsync({
      id: params.id,
      data: { isPublished: checked },
    });
  };

  const handleRegistrationRequiredChange = async (checked: boolean) => {
    setRegistrationRequired(checked);
    await updateEventMutation.mutateAsync({
      id: params.id,
      data: { isRegistrationRequired: checked },
    });
  };

  const handleArchiveEvent = async () => {
    try {
      await archiveEventMutation.mutateAsync(params.id);
      setShowArchiveModal(false);
      router.push("/events");
    } catch {
      setShowArchiveModal(false);
    }
  };

  const handleUnarchiveEvent = async () => {
    try {
      await unarchiveEventMutation.mutateAsync(params.id);
      setShowUnarchiveModal(false);
      router.push("/events");
    } catch {
      setShowUnarchiveModal(false);
    }
  };

  const handlePublishEvent = async () => {
    try {
      await publishEventMutation.mutateAsync(params.id);
      setShowPublishModal(false);
    } catch {
      setShowPublishModal(false);
    }
  };

  const clearFieldError = (field: "name" | "description" | "dateStart" | "dateEnd") => {
    setEventDetailsErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleStartEventDetailsEdit = () => {
    initializeEditFields(event);
    setEventDetailsErrors({});
    setIsEditingEventDetails(true);
  };

  const handleCancelEventDetailsEdit = () => {
    initializeEditFields(event);
    setEventDetailsErrors({});
    setIsEditingEventDetails(false);
  };

  const disableEndDatesBeforeStart = (date: Date) => {
    if (!editedDateStart) return false;

    const startDate = new Date(editedDateStart);
    if (Number.isNaN(startDate.getTime())) return false;

    startDate.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    return targetDate < startDate;
  };

  const handleSaveEventDetails = async () => {
    if (!event) return;

    const payloadToValidate = {
      name: editedName.trim(),
      description: editedDescription.trim(),
      dateStart: editedDateStart,
      dateEnd: editedDateEnd,
    };

    const validationResult = updateEventSchema.safeParse(payloadToValidate);

    if (!validationResult.success) {
      const nextErrors: Partial<
        Record<"name" | "description" | "dateStart" | "dateEnd", string>
      > = {};

      validationResult.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (
          typeof field === "string" &&
          ["name", "description", "dateStart", "dateEnd"].includes(field) &&
          !nextErrors[field as "name" | "description" | "dateStart" | "dateEnd"]
        ) {
          nextErrors[field as "name" | "description" | "dateStart" | "dateEnd"] =
            issue.message;
        }
      });

      setEventDetailsErrors(nextErrors);
      showToast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix any errors before saving.",
      });
      return;
    }

    const currentStartDate = formatDateToIso(event.dateStart);
    const currentEndDate = formatDateToIso(event.dateEnd);

    const changedPayload: {
      name?: string;
      description?: string;
      dateStart?: string;
      dateEnd?: string;
    } = {};

    if (payloadToValidate.name !== event.name) {
      changedPayload.name = payloadToValidate.name;
    }

    if (payloadToValidate.description !== event.description) {
      changedPayload.description = payloadToValidate.description;
    }

    if (payloadToValidate.dateStart !== currentStartDate) {
      changedPayload.dateStart = payloadToValidate.dateStart;
    }

    if (payloadToValidate.dateEnd !== currentEndDate) {
      changedPayload.dateEnd = payloadToValidate.dateEnd;
    }

    if (Object.keys(changedPayload).length === 0) {
      setIsEditingEventDetails(false);
      setEventDetailsErrors({});
      return;
    }

    try {
      await updateEventMutation.mutateAsync({
        id: params.id,
        data: changedPayload,
      });

      setIsEditingEventDetails(false);
      setEventDetailsErrors({});

      showToast({
        variant: "success",
        title: "Success",
        description: "Event details updated successfully.",
      });
    } catch (error) {
      console.error("Failed to save event details:", error);

      showToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save event details. Please try again.",
      });
    }
  };

  const handleDeleteBanner = async () => {
    if (bannerImageData) {
      try {
        // Delete from storage if it has a key
        if (bannerImageData.key) {
          console.log("Deleting banner with key:", bannerImageData.key);
          await deleteAsset(bannerImageData.key);
          console.log("Banner deleted from storage successfully");
        }

        // Remove from database
        await updateEventMutation.mutateAsync({
          id: params.id,
          data: { banner: "" },
        });
        console.log("Banner removed from database successfully");

        // Clear state
        setBannerImageData(null);
        toast.success("Banner image removed successfully!");
      } catch (error) {
        console.error("Failed to delete banner:", error);
        toast.error(`Failed to remove banner image`);
      }
    }
    setShowBannerDeleteConfirm(false);
  };

  const handleDeleteThumbnail = async () => {
    if (thumbnailImageData) {
      try {
        // Delete from storage if it has a key
        if (thumbnailImageData.key) {
          console.log("Deleting thumbnail with key:", thumbnailImageData.key);
          await deleteAsset(thumbnailImageData.key);
          console.log("Thumbnail deleted from storage successfully");
        }

        // Remove from database
        await updateEventMutation.mutateAsync({
          id: params.id,
          data: { thumbnail: "" },
        });
        console.log("Thumbnail removed from database successfully");

        // Clear state
        setThumbnailImageData(null);
        toast.success("Thumbnail image removed successfully!");
      } catch (error) {
        console.error("Failed to delete thumbnail:", error);
        toast.error(`Failed to remove thumbnail image`);
      }
    }
    setShowThumbnailDeleteConfirm(false);
  };

  // REPLACE THIS FUNCTION
  const handleCreateTicket = async (data: Omit<Tickets, "id">) => {
    console.log("Creating ticket:", data);
    console.log("Event ID:", params.id);

    try {
      const ticketData = {
        ...data,
        eventId: params.id,
      };

      console.log("Sending to API:", ticketData);

      await createTicketMutation.mutateAsync(ticketData);

      console.log("Ticket created!");

      toast.success("Ticket created successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Failed to create ticket:", error);
      showToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create ticket. Please try again.",
      });
    }
  };

  const handleUpdateTicket = async (updated: Tickets) => {
    console.log("📝 Updating ticket:", updated);

    try {
      const { id, ...ticketData } = updated;

      await updateTicketMutation.mutateAsync({
        id,
        data: ticketData,
      });

      toast.success("Ticket updated successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error(" Failed to update ticket:", error);
      showToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update ticket. Please try again.",
      });
    }
  };

  // ADD THIS FUNCTION
  const handleDeleteTicket = async (ticketId: string) => {
    console.log("🗑️ Deleting ticket:", ticketId);

    try {
      await deleteTicketMutation.mutateAsync(ticketId);

      toast.success("Ticket archived successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("❌ Failed to delete ticket:", error);
      showToast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete ticket. Please try again.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">Failed to load event details</p>
          <p className="text-gray-600 text-sm">
            {error?.message || "Event not found"}
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const handleIsAttendedChange = async (
    registrationId: string,
    isAttended: boolean,
  ) => {
    updateRegistration.mutate({
      id: registrationId,
      data: { isAttended },
    });
  };

  const columns = createRegistrationsColumns({
    onIsAttendedChange: handleIsAttendedChange,
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-10 px-6">
        {/* <UploadImage
          onUploadComplete={(imageData) => {
            // imageData is a JSON object with:
            // {
            //   name: "image.png",
            //   type: "image/png",
            //   size: 12345,
            //   data: "data:image/png;base64,...",
            //   url: "data:image/png;base64,..."
            // }

            // You can save this to a JSON file:
            // const jsonString = JSON.stringify(imageData, null, 2);
            // Or use it directly
            console.log(imageData);
          }}
        /> */}
        <Toaster position="bottom-right" />

        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/events")}
          className="mb-6 text-gray-600 hover:text-gray-900 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        {/* Header */}
        <div className="mb-8">
          {isEditingEventDetails ? (
            <div className="space-y-4">
              <div className="space-y-2 max-w-3xl">
                <label className="text-sm font-medium text-gray-900">Event Name</label>
                <Input
                  value={editedName}
                  onChange={(e) => {
                    setEditedName(e.target.value);
                    clearFieldError("name");
                  }}
                  placeholder="Enter event name"
                  className={eventDetailsErrors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                  aria-invalid={!!eventDetailsErrors.name}
                />
                {eventDetailsErrors.name && (
                  <p className="text-sm text-red-600">{eventDetailsErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Start Date & Time</label>
                  <DateTimePicker
                    name="dateStart"
                    value={editedDateStart}
                    onBlur={() => undefined}
                    onChange={(value) => {
                      setEditedDateStart(value);
                      clearFieldError("dateStart");
                    }}
                  />
                  {eventDetailsErrors.dateStart && (
                    <p className="text-sm text-red-600">{eventDetailsErrors.dateStart}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">End Date & Time</label>
                  <DateTimePicker
                    name="dateEnd"
                    value={editedDateEnd}
                    onBlur={() => undefined}
                    onChange={(value) => {
                      setEditedDateEnd(value);
                      clearFieldError("dateEnd");
                    }}
                    disabledDate={disableEndDatesBeforeStart}
                  />
                  {eventDetailsErrors.dateEnd && (
                    <p className="text-sm text-red-600">{eventDetailsErrors.dateEnd}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-6 text-blue-600">
                {event.org && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    <span className="text-base">{event.org.name}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end max-w-3xl">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEventDetailsEdit}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveEventDetails}
                  disabled={updateEventMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updateEventMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.name}</h1>
                <div className="flex items-center gap-6 text-blue-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    <span className="text-base">
                      {formatDate(event.dateStart.toString())} | {formatTime(event.dateStart.toString())}
                    </span>
                  </div>
                  {event.org && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      <span className="text-base">{event.org.name}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:text-blue-600 hover:bg-gray-50 bg-transparent rounded-sm font-semibold shadow-sm"
                onClick={handleStartEventDetailsEdit}
              >
                Edit Event Details
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-col lg:flex-row gap-8 mb-24">
          {/* Event Details Section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Event Details
            </h2>
            {isEditingEventDetails ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => {
                      setEditedDescription(e.target.value);
                      clearFieldError("description");
                    }}
                    className={`min-h-[200px] text-gray-700 leading-relaxed ${
                      eventDetailsErrors.description
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    placeholder="Enter event description..."
                    aria-invalid={!!eventDetailsErrors.description}
                    aria-describedby={
                      eventDetailsErrors.description
                        ? "description-error"
                        : undefined
                    }
                  />
                  <div className="flex items-center justify-between">
                    {eventDetailsErrors.description ? (
                      <p
                        id="description-error"
                        className="text-sm text-red-600 font-medium"
                      >
                        {eventDetailsErrors.description}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Description must be at least 10 characters.
                      </p>
                    )}
                    <p
                      className={`text-sm ${
                        editedDescription.length > 5000
                          ? "text-red-600 font-medium"
                          : editedDescription.length < 10
                            ? "text-orange-600"
                            : "text-gray-500"
                      }`}
                    >
                      {editedDescription.length} / 5000 characters
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p
                    className="text-gray-700 leading-relaxed text-justify p-2"
              >
                {showFullDescription
                  ? event.description
                  : truncateText(event.description, 600)}
                {event.description.length > 600 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="ml-1 font-semibold text-gray-900 hover:underline"
                  >
                    {showFullDescription ? "See Less..." : "See More..."}
                  </button>
                )}
              </p>
            )}
          </div>
          {/* Event Design Section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-4">Event Design</h2>
            <p className="text-gray-600 text-sm mb-6">
              Your uploaded images will be what users see while viewing the
              event&apos;s details.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Banner Upload */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner
                </label>
                <div
                  onClick={() => setShowBannerModal(true)}
                  className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 p-8 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-150 transition-colors relative overflow-hidden group"
                >
                  {bannerImageData ? (
                    <>
                      <Image
                        src={bannerImageData.url}
                        alt="Banner preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-medium">
                          Change Image
                        </span>
                      </div>
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowBannerDeleteConfirm(true);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10"
                        title="Remove banner"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center mb-3">
                        <span className="text-gray-400 text-2xl">+</span>
                      </div>
                      <span className="text-gray-500 text-sm font-medium">
                        Upload Image
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thumbnail
                </label>
                <div
                  onClick={() => setShowThumbnailModal(true)}
                  className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 p-8 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-150 transition-colors relative overflow-hidden group"
                >
                  {thumbnailImageData ? (
                    <>
                      <Image
                        src={thumbnailImageData.url}
                        alt="Thumbnail preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-medium">
                          Change Image
                        </span>
                      </div>
                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowThumbnailDeleteConfirm(true);
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 z-10"
                        title="Remove thumbnail"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center mb-3">
                        <span className="text-gray-400 text-2xl">+</span>
                      </div>
                      <span className="text-gray-500 text-sm font-medium">
                        Upload Image
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex overflow-x-auto gap-8 whitespace-nowrap scrollbar-hide">
            <button
              onClick={() => setActiveTab("registration")}
              className={`pb-4 px-1 text-base font-medium transition-colors ${
                activeTab === "registration"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Registration
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`pb-4 px-1 text-base font-medium transition-colors ${
                activeTab === "tickets"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Tickets
            </button>
            <button
              onClick={() => setActiveTab("announcements")}
              className={`pb-4 px-1 text-base font-medium transition-colors ${
                activeTab === "announcements"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveTab("additional-details")}
              className={`pb-4 px-1 text-base font-medium transition-colors ${
                activeTab === "additional-details"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Additional Details
            </button>
          </nav>
        </div>

        {activeTab === "additional-details" && (
        <div className="space-y-6 mb-16">
          <div className="flex items-start justify-between py-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Registration Open
              </h3>
              <p className="text-sm text-gray-600">
                Controls whether users can request or purchase tickets right
                now. If turned off, the registration button will show as closed.
              </p>
            </div>
            <Switch
              checked={registrationOpen}
              onCheckedChange={handleRegistrationOpenChange}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <div className="flex items-start justify-between py-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Event Visibility
              </h3>
              <p className="text-sm text-gray-600">
                Controls whether this event is published and visible on the
                platform. When turned off, it acts as a hidden draft.
              </p>
            </div>
            <Switch
              checked={eventVisibility}
              onCheckedChange={handleEventVisibilityChange}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          <div className="flex items-start justify-between py-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Registration Required
              </h3>
              <p className="text-sm text-gray-600">
                Determines if a ticket is mandatory. If turned off, this becomes
                a walk-in event, and ticketing sections are hidden from users.
              </p>
            </div>
            <Switch
              checked={registrationRequired}
              onCheckedChange={handleRegistrationRequiredChange}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
          </div>
        )}

        {activeTab === "registration" && (
          <div className="space-y-6 mb-16">
            <DataTable
              title="Registrations"
              columns={columns}
              data={registrationsData?.data || []}
              searchColumn="fullName"
              searchPlaceholder="Search by name or email..."
              entityName="registrations"
              pagination={{
                page,
                limit,
                totalCount: registrationsData?.meta?.totalCount || 0,
                totalPages: registrationsData?.meta?.totalPages || 0,
                onPageChange: setPage,
                onLimitChange: setLimit,
              }}
              search={{
                value: searchFilter,
                onSearchChange: setSearchFilter,
              }}
              filters={[
                {
                  field: "cluster",
                  placeholder: "Select Cluster",
                  value: clusterFilter,
                  onChange: setClusterFilter,
                },
                {
                  field: "course",
                  placeholder: "Select Course",
                  value: courseFilter,
                  onChange: setCourseFilter,
                },
                {
                  field: "ticketCategory.name",
                  placeholder: "Select Ticket Category",
                  value: ticketCategoryFilter,
                  onChange: setTicketCategoryFilter,
                },
              ]}
            />
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="space-y-8">
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-blue-600 text-blue-600 hover:text-blue-600 hover:bg-gray-50 bg-transparent rounded-sm font-semibold shadow-sm"
                onClick={() => setModal(true)}
              >
                <CirclePlus className="h-5 w-5 text-blue-600" />
                Add Ticket
              </Button>
            </div>

            {modal && (
              <CreateTicket
                setModal={setModal}
                title="Create Ticket"
                titleName="Title Name"
                titleDesc="Description"
                onCreate={handleCreateTicket}
              />
            )}

            {ticketsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">{`No tickets created yet. Click "Add Ticket" to create one.`}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
                {tickets.map((ticket: Tickets) => (
                  <CardTicket
                    key={ticket.id}
                    ticket={ticket}
                    onUpdate={handleUpdateTicket}
                    onDelete={handleDeleteTicket}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "announcements" && (
          <div className="space-y-8">
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-blue-600 text-blue-600 hover:text-blue-600 hover:bg-gray-50 bg-transparent rounded-sm font-semibold shadow-sm"
                onClick={() => setShowCreateAnnouncement(true)}
              >
                <CirclePlus className="h-5 w-5 text-blue-600" />
                Add Announcement
              </Button>
            </div>

            <AnnouncementList eventId={params.id} />
          </div>
        )}

        {/* Archive and Publish Buttons */}
        <div className="flex justify-end gap-4 mt-16 pt-8 border-t border-gray-200">
          {/* PUBLISH BUTTON REMOVED */}
          {/* <Button
            variant="outline"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            onClick={() => setShowPublishModal(true)}
            disabled={publishEventMutation.isPending || event.isPublished}
          >
            {event.isPublished ? "Published" : "Publish Event"}
          </Button> */}
          {event.isArchived ? (
            <Button
              variant="outline"
              className="flex items-center gap-2 border-green-600 text-green-700 hover:bg-green-50 bg-transparent"
              onClick={() => setShowUnarchiveModal(true)}
              disabled={unarchiveEventMutation.isPending}
            >
              <Archive className="h-4 w-4 text-green-600" />
              Unarchive Event
            </Button>
          ) : (
            <Button
              variant="outline"
              className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              onClick={() => setShowArchiveModal(true)}
              disabled={archiveEventMutation.isPending}
            >
              <Archive className="h-4 w-4 text-blue-600" />
              Archive Event
            </Button>
          )}
        </div>

        {/* Modals */}
        <ConfirmationModal
          isOpen={showPublishModal}
          onClose={() => setShowPublishModal(false)}
          onConfirm={handlePublishEvent}
          title="Publish Event"
          description="Are you sure you want to publish this event? Once published, it will be visible to all users."
          confirmText="Publish Event"
          cancelText="Cancel"
          isLoading={publishEventMutation.isPending}
          variant="default"
        />

        <ConfirmationModal
          isOpen={showArchiveModal}
          onClose={() => setShowArchiveModal(false)}
          onConfirm={handleArchiveEvent}
          title="Archive Event"
          description="Are you sure you want to archive this event? This action will hide the event from the active events list but can be restored later."
          confirmText="Archive Event"
          cancelText="Cancel"
          isLoading={archiveEventMutation.isPending}
          variant="default"
        />

        <ConfirmationModal
          isOpen={showUnarchiveModal}
          onClose={() => setShowUnarchiveModal(false)}
          onConfirm={handleUnarchiveEvent}
          title="Unarchive Event"
          description="Are you sure you want to unarchive this event? This action will move the event back to the Drafts tab."
          confirmText="Unarchive Event"
          cancelText="Cancel"
          isLoading={unarchiveEventMutation.isPending}
          variant="default"
        />

        {/* Create Announcement Modal */}
        <AnnouncementModal
          isOpen={showCreateAnnouncement}
          onClose={() => setShowCreateAnnouncement(false)}
          eventId={params.id} // no announcement prop = create mode
        />

        {/* Upload Banner Modal */}
        <UploadBannerModal
          isOpen={showBannerModal}
          onClose={() => setShowBannerModal(false)}
          existingImageKey={bannerImageData?.key}
          onSubmit={async (uploadData) => {
            setBannerImageData(uploadData);
            console.log("Banner saved to state:", uploadData);

            // Automatically save to database
            try {
              await updateEventMutation.mutateAsync({
                id: params.id,
                data: { banner: uploadData.url },
              });
              toast.success("Banner image uploaded and saved!");
              setShowBannerModal(false); // Close modal after success
            } catch (error) {
              console.error("Failed to save banner:", error);
              toast.error("Failed to save banner to database");
            }
          }}
        />

        {/* Upload Thumbnail Modal */}
        <UploadThumbnailModal
          isOpen={showThumbnailModal}
          onClose={() => setShowThumbnailModal(false)}
          existingImageKey={thumbnailImageData?.key}
          onSubmit={async (uploadData) => {
            setThumbnailImageData(uploadData);
            console.log("Thumbnail saved to state:", uploadData);

            // Automatically save to database
            try {
              await updateEventMutation.mutateAsync({
                id: params.id,
                data: { thumbnail: uploadData.url },
              });
              toast.success("Thumbnail image uploaded and saved!");
              setShowThumbnailModal(false); // Close modal after success
            } catch (error) {
              console.error("Failed to save thumbnail:", error);
              toast.error("Failed to save thumbnail to database");
            }
          }}
        />

        {/* Delete Banner Confirmation Modal */}
        <ConfirmationModal
          isOpen={showBannerDeleteConfirm}
          onClose={() => setShowBannerDeleteConfirm(false)}
          onConfirm={handleDeleteBanner}
          title="Remove Banner Image"
          description="Are you sure you want to remove the banner image? This action cannot be undone."
          confirmText="Yes, Remove"
          cancelText="Cancel"
          isLoading={updateEventMutation.isPending}
          variant="destructive"
        />

        {/* Delete Thumbnail Confirmation Modal */}
        <ConfirmationModal
          isOpen={showThumbnailDeleteConfirm}
          onClose={() => setShowThumbnailDeleteConfirm(false)}
          onConfirm={handleDeleteThumbnail}
          title="Remove Thumbnail Image"
          description="Are you sure you want to remove the thumbnail image? This action cannot be undone."
          confirmText="Yes, Remove"
          cancelText="Cancel"
          isLoading={updateEventMutation.isPending}
          variant="destructive"
        />
      </div>
    </div>
  );
}
