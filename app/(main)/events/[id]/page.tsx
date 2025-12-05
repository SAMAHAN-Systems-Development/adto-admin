"use client";

import { useState, useEffect } from "react";
import { Calendar, MapPin, Archive, ArrowLeft } from "lucide-react";
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
import AssetsUpload from "@/components/features/events/assets-uploads-section";

interface EventDetailsPageProps {
  params: {
    id: string;
  };
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("additional-details");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Fetch event data
  const { data: event, isLoading, error } = useEventQuery(params.id);
  const updateEventMutation = useUpdateEventMutation();
  const archiveEventMutation = useArchiveEventMutation();
  const publishEventMutation = usePublishEventMutation();

  // Local state for switches
  const [registrationOpen, setRegistrationOpen] = useState(
    event?.isRegistrationOpen ?? false
  );
  const [openToAll, setOpenToAll] = useState(event?.isOpenToOutsiders ?? false);
  const [registrationRequired, setRegistrationRequired] = useState(
    event?.isRegistrationRequired ?? true
  );

  // Update local state when event data is loaded
  useEffect(() => {
    if (event) {
      setRegistrationOpen(event.isRegistrationOpen);
      setOpenToAll(event.isOpenToOutsiders);
      setRegistrationRequired(event.isRegistrationRequired);
    }
  }, [event]);

  const handleRegistrationOpenChange = async (checked: boolean) => {
    setRegistrationOpen(checked);
    await updateEventMutation.mutateAsync({
      id: params.id,
      data: { isRegistrationOpen: checked },
    });
  };

  const handleOpenToAllChange = async (checked: boolean) => {
    setOpenToAll(checked);
    await updateEventMutation.mutateAsync({
      id: params.id,
      data: { isOpenToOutsiders: checked },
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
    setDescriptionError(null); // Clear any previous errors
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
          err.path.includes("description")
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
      toast({
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

      toast({
        variant: "success",
        title: "Success",
        description: "Event description updated successfully.",
      });
    } catch (error) {
      console.error("Failed to save description:", error);

      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      setDescriptionError(errorMessage);

      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to save description: ${errorMessage}`,
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditingDescription(false);
    setEditedDescription(event?.description || "");
    setDescriptionError(null); // Clear errors when canceling
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

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-10 px-6">
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

        {/* Event Details Section */}
        <div className="mb-8">
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
                  {updateEventMutation.isPending ? "Saving..." : "Save Changes"}
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
              onClick={() => setActiveTab("assets-uploads")}
              className={`pb-4 px-1 text-base font-medium transition-colors ${
                activeTab === "assets-uploads"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Assets Upload
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
                  Open to All Participants
                </h3>
                <p className="text-sm text-gray-600">
                  Enable this if anyone can join the event. Disable if the event
                  is restricted to invited or specific groups only.
                </p>
              </div>
              <Switch
                checked={openToAll}
                onCheckedChange={handleOpenToAllChange}
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
          <div className="py-8 text-center text-gray-500">
            Registration content coming soon...
          </div>
        )}

        {activeTab === "tickets" && (
          <div className="py-8 text-center text-gray-500">
            Tickets content coming soon...
          </div>
        )}

         {activeTab === "assets-uploads" && (
          <div className="py-8 text-center text-gray-500">
            <AssetsUpload />
          </div>
        )}

        {activeTab === "announcements" && (
          <div className="py-8 text-center text-gray-500">
            Announcements content coming soon...
          </div>
        )}

        {/* Archive and Publish Buttons - At the very bottom */}
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

        {/* Publish Confirmation Modal */}
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

        {/* Archive Confirmation Modal */}
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
      </div>
    </div>
  );
}
