"use client";

import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "@/components/shared/data-table";
import {
  createEventsColumns,
  EventTab,
} from "@/components/features/events/events-columns";
import { CreateEventModal } from "@/components/features/events/create-event-modal";
import { ViewEventModal } from "@/components/features/events/view-event-modal";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useEventsQuery } from "@/lib/api/queries/eventsQueries";
import { useArchiveEventMutation } from "@/lib/api/mutations/eventsMutations";
import { useRouter, useSearchParams } from "next/navigation";
import type { Event } from "@/lib/types/entities";
import { toast } from "sonner";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useAuthStore } from "@/lib/store/authStore";
import { useQueryClient } from "@tanstack/react-query";

const EVENT_TABS: { label: string; value: EventTab }[] = [
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Drafts", value: "DRAFT" },
  { label: "Finished", value: "FINISHED" },
  { label: "Archived", value: "ARCHIVED" },
];

export default function EventsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [eventToArchive, setEventToArchive] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchFilter, setSearchFilter] = useState("");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");
  const [eventStatusFilter, setEventStatusFilter] =
    useState<EventTab>("UPCOMING");

  // Track if this is the initial load
  const isInitialLoad = useRef(true);

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(searchFilter, 500);

  useEffect(() => {
    if (user) {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  }, [user, queryClient]);

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setIsCreateModalOpen(true);
      // Clean up the URL to prevent reopening on refresh
      window.history.replaceState({}, "", "/events");
    }
  }, [searchParams]);

  const { data, isLoading, error, isFetching } = useEventsQuery({
    page,
    limit,
    searchFilter: debouncedSearch,
    orderBy,
    eventStatus: eventStatusFilter,
  });

  const events = data?.data || [];
  const meta = data?.meta;

  // After first successful load, mark as no longer initial
  useEffect(() => {
    if (data && isInitialLoad.current) {
      isInitialLoad.current = false;
    }
  }, [data]);

  // Reset to page 1 when search or tab changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, eventStatusFilter]);

  const archiveEventMutation = useArchiveEventMutation();

  const handleViewEvent = React.useCallback((event: Event) => {
    setSelectedEvent(event);
    setIsViewModalOpen(true);
  }, []);

  const handleEditEvent = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleArchiveEvent = React.useCallback((eventId: string) => {
    setEventToArchive(eventId);
    setShowArchiveDialog(true);
  }, []);

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
      tab: eventStatusFilter,
    });

    if (user?.role === "ORGANIZATION") {
      return allColumns.filter((col) => {
        if ("accessorKey" in col) {
          return (col as { accessorKey: string }).accessorKey !== "org.name";
        }
        return true;
      });
    }

    return allColumns;
  }, [user?.role, handleArchiveEvent, handleViewEvent, eventStatusFilter]);

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
      <h1 className="text-4xl font-bold text-gray-900 mb-2">My Events</h1>
      <p className="text-gray-600 mb-8">
        Manage and track your organization&apos;s events.
      </p>

      {/* Status Filter Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-6">
          {EVENT_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setEventStatusFilter(tab.value)}
              className={`pb-3 px-1 text-sm font-medium transition-colors ${
                eventStatusFilter === tab.value
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <DataTable
        title=""
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
            setPage(1);
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
            setPage(1);
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