"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Archive, ArrowLeft, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEventQuery } from "@/lib/api/queries/eventsQueries";
import {
  useUpdateEventMutation,
  useArchiveEventMutation,
  usePublishEventMutation,
} from "@/lib/api/mutations/eventsMutations";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
import { updateEventSchema } from "@/lib/zod/event.schema";
import { z } from "zod";
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
import UploadImage from "@/components/shared/upload-image";
import { UploadBannerModal } from "@/components/features/events/upload-banner-modal";
import { UploadThumbnailModal } from "@/components/features/events/upload-thumbnail-modal";

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
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showCreateAnnouncement, setShowCreateAnnouncement] = useState(false);
  const [modal, setModal] = useState(false);
  const [clusterFilter, setClusterFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState("all");
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [showThumbnailModal, setShowThumbnailModal] = useState(false);

  const eventId = params.id;
  console.log(eventId, "WTF EVENT ID");
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
  const publishEventMutation = usePublishEventMutation();

  // ADD THESE: Fetch tickets and mutations
  const { data: ticketsData, isLoading: ticketsLoading } = useEventTicketsQuery(
    { eventId: params.id },
  );
  const createTicketMutation = useCreateEventTicketMutation();
  const updateTicketMutation = useUpdateEventTicketMutation();
  const deleteTicketMutation = useDeleteEventTicketMutation();

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

  // Update local state when event data is loaded
  useEffect(() => {
    if (event) {
      setRegistrationOpen(event.isRegistrationOpen);
      setEventVisibility(event.isPublished);
      setRegistrationRequired(event.isRegistrationRequired);
    }
  }, [event]);

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
    await archiveEventMutation.mutateAsync(params.id);
    setShowArchiveModal(false);
    router.push("/events");
  };

  const handlePublishEvent = async () => {
    await publishEventMutation.mutateAsync(params.id);
    setShowPublishModal(false);
  };

  const handleDescriptionDoubleClick = () => {
    setIsEditingDescription(true);
    setEditedDescription(event?.description || "");
    setDescriptionError(null);
  };

  const validateDescription = (description: string): boolean => {
    setDescriptionError(null);

    if (!description.trim()) {
      setDescriptionError("Description cannot be empty");
      return false;
    }

    try {
      updateEventSchema.parse({ description });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const descriptionErrors = error.errors.filter((err) =>
          err.path.includes("description"),
        );
        if (descriptionErrors.length > 0) {
          setDescriptionError(descriptionErrors[0].message);
          return false;
        }
      }
      return true;
    }
  };

  const handleSaveDescription = async () => {
    if (!validateDescription(editedDescription)) {
      showToast({
        variant: "destructive",
        title: "Validation Error",
        description: descriptionError || "Please fix any errors before saving.",
      });
      return;
    }

    if (editedDescription.trim() === event?.description) {
      setIsEditingDescription(false);
      setDescriptionError(null);
      return;
    }

    try {
      await updateEventMutation.mutateAsync({
        id: params.id,
        data: { description: editedDescription },
      });

      setIsEditingDescription(false);
      setDescriptionError(null);

      showToast({
        variant: "success",
        title: "Success",
        description: "Event description updated successfully.",
      });
    } catch (error) {
      console.error("Failed to save description:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      setDescriptionError(errorMessage);

      showToast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save description: ${errorMessage}`,
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingDescription(false);
    setEditedDescription(event?.description || "");
    setDescriptionError(null);
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {event.name}
          </h1>
          <div className="flex items-center gap-6 text-blue-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span className="text-base">
                {formatDate(event.dateStart.toString())} |{" "}
                {formatTime(event.dateStart.toString())}
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
        <div className="flex gap-8 mb-24">
          {/* Event Details Section */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Event Details
            </h2>
            {isEditingDescription ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => {
                      setEditedDescription(e.target.value);
                      if (descriptionError) {
                        setDescriptionError(null);
                      }
                    }}
                    className={`min-h-[200px] text-gray-700 leading-relaxed ${
                      descriptionError
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    placeholder="Enter event description..."
                    aria-invalid={!!descriptionError}
                    aria-describedby={
                      descriptionError ? "description-error" : undefined
                    }
                  />
                  <div className="flex items-center justify-between">
                    {descriptionError ? (
                      <p
                        id="description-error"
                        className="text-sm text-red-600 font-medium"
                      >
                        {descriptionError}
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
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSaveDescription}
                    disabled={updateEventMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {updateEventMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              </div>
            ) : (
              <p
                className="text-gray-700 leading-relaxed text-justify cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onDoubleClick={handleDescriptionDoubleClick}
                title="Double click to edit"
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
              event's details.
            </p>

            <div className="flex gap-4">
              {/* Banner Upload */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner
                </label>
                <div
                  onClick={() => setShowBannerModal(true)}
                  className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 p-8 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-150 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center mb-3">
                    <span className="text-gray-400 text-2xl">+</span>
                  </div>
                  <span className="text-gray-500 text-sm font-medium">
                    Upload Image
                  </span>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Thumbnail
                </label>
                <div
                  onClick={() => setShowThumbnailModal(true)}
                  className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 p-8 h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-150 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-gray-400 flex items-center justify-center mb-3">
                    <span className="text-gray-400 text-2xl">+</span>
                  </div>
                  <span className="text-gray-500 text-sm font-medium">
                    Upload Image
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex gap-8">
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
                  Enable this if the event registration is currently open for
                  participants.
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
                  Enable this to make the event visible to participants. When
                  turned off, the event will be hidden and inaccessible to the
                  public.
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
                  Enable this if participants must register before attending the
                  event.
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
          <div className="py-4 text-gray-500">
            <div className="">
              <div className="flex justify-end w-full">
                <button
                  onClick={() => setModal(true)}
                  className="border-2 border-blue-600 text-blue-600 px-4 py-2 rounded flex gap-4 hover:bg-blue-50 transition-colors"
                >
                  <CirclePlus /> Add Ticket
                </button>
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
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
            onClick={() => setShowPublishModal(true)}
            disabled={publishEventMutation.isPending || event.isPublished}
          >
            {event.isPublished ? "Published" : "Publish Event"}
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
            onClick={() => setShowArchiveModal(true)}
            disabled={archiveEventMutation.isPending}
          >
            <Archive className="h-4 w-4 text-blue-600" />
            Archive Event
          </Button>
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
        />

        {/* Upload Thumbnail Modal */}
        <UploadThumbnailModal
          isOpen={showThumbnailModal}
          onClose={() => setShowThumbnailModal(false)}
        />
      </div>
    </div>
  );
}
