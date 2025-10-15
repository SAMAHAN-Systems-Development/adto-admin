"use client";

import React, { useState, useEffect } from "react";
import { DataTable } from "@/components/shared/data-table";
import { createEventsColumns } from "@/components/features/events/events-columns";
import { CreateEventModal } from "@/components/features/events/create-event-modal";
import { ViewEventModal } from "@/components/features/events/view-event-modal";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useOrganizationEventsQuery } from "@/lib/api/queries/eventsQueries";
import { useArchiveEventMutation } from "@/lib/api/mutations/eventsMutations";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import type { Event } from "@/lib/types/entities";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function EventsPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [eventToArchive, setEventToArchive] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchFilter, setSearchFilter] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");

  const { user } = useAuthStore();
  const orgId = user?.orgId;

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchFilter, 500);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isLoading, error } = useOrganizationEventsQuery(orgId || "", {
    page,
    limit,
    searchFilter: debouncedSearch,
    orderBy,
  });
  const events = data?.data || [];
  const meta = data?.meta;

  const archiveEventMutation = useArchiveEventMutation();

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  };

  const handleEditEvent = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleArchiveEvent = (eventId: string) => {
    setEventToArchive(eventId);
    setShowArchiveDialog(true);
  };

  const handleArchiveConfirm = async () => {
    if (eventToArchive) {
      try {
        await archiveEventMutation.mutateAsync(eventToArchive);
        toast.success("Event archived successfully", {
          description:
            "The event has been removed from the active events list.",
        });
        setShowArchiveDialog(false);
        setEventToArchive(null);
      } catch {
        toast.error("Failed to archive event", {
          description:
            "An error occurred while archiving the event. Please try again.",
        });
      }
    }
  };

  const handleArchiveCancel = () => {
    setShowArchiveDialog(false);
    setEventToArchive(null);
  };

  const columns = createEventsColumns({
    onArchiveEvent: handleArchiveEvent,
    onViewEvent: handleViewEvent,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-96 w-full bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Error loading events
          </h1>
          <p className="text-gray-600 mt-2">
            Failed to load events. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        title="My Events"
        columns={columns}
        data={events}
        searchColumn="name"
        searchPlaceholder="Search events by name, description, or organization..."
        addButtonLabel="Add Event"
        onCreateItem={() => setIsCreateModalOpen(true)}
        entityName="events"
        search={{
          value: searchFilter,
          onSearchChange: setSearchFilter,
        }}
        sorting={{
          field: "dateStart",
          order: orderBy,
          onSortChange: (field, order) => {
            setOrderBy(order);
            setPage(1); // Reset to first page when sorting changes
          },
        }}
        pagination={{
          page,
          limit,
          totalCount: meta?.totalCount || 0,
          totalPages: meta?.totalPages || 0,
          onPageChange: setPage,
          onLimitChange: (newLimit) => {
            setLimit(newLimit);
            setPage(1); // Reset to first page when limit changes
          },
        }}
      />

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ViewEventModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        event={selectedEvent}
        onEdit={() => selectedEvent && handleEditEvent(selectedEvent.id)}
      />

      <ConfirmationModal
        isOpen={showArchiveDialog}
        onClose={handleArchiveCancel}
        onConfirm={handleArchiveConfirm}
        title="Archive Event?"
        description="Are you sure you want to archive this event? This action will remove it from the active events list."
        confirmText="Yes, archive event"
        cancelText="No, keep event"
        isLoading={archiveEventMutation.isPending}
        variant="destructive"
      />
    </div>
  );
}
