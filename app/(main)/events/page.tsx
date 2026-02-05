"use client";

import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "@/components/shared/data-table";
import { createEventsColumns } from "@/components/features/events/events-columns";
import { CreateEventModal } from "@/components/features/events/create-event-modal";
import { ViewEventModal } from "@/components/features/events/view-event-modal";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useEventsQuery } from "@/lib/api/queries/eventsQueries";
import { useArchiveEventMutation } from "@/lib/api/mutations/eventsMutations";
import { useRouter } from "next/navigation";
import type { Event } from "@/lib/types/entities";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useAuthStore } from "@/lib/store/authStore";
import { useQueryClient } from "@tanstack/react-query";

export default function EventsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [eventToArchive, setEventToArchive] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchFilter, setSearchFilter] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");

  // Track if this is the initial load
  const isInitialLoad = useRef(true);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchFilter, 500);

  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  }, [user?.id, user?.orgId, queryClient]);

  const { data, isLoading, error, isFetching } = useEventsQuery({
    page,
    limit,
    searchFilter: debouncedSearch,
    orderBy,
  });

  const events = data?.data || [];
  const meta = data?.meta;

  // After first successful load, mark as no longer initial
  useEffect(() => {
    if (data && isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [data]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

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

  const columns = React.useMemo(() => {
    const allColumns = createEventsColumns({
      onArchiveEvent: handleArchiveEvent,
      onViewEvent: handleViewEvent,
    });

    if (user?.role === "ORGANIZATION") {
      return allColumns.filter((col) => (col as any).accessorKey !== "org.name");
    }

    return allColumns;
  }, [user?.role, handleArchiveEvent, handleViewEvent]);

  // Only show full page loading skeleton on initial load
  if (isLoading && isInitialLoad.current) {
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
        onRowClick={(event) => handleViewEvent(event)}
        isTableLoading={isFetching && !isInitialLoad.current}
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