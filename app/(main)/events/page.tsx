"use client";

import React, { useState } from "react";
import { EventsDataTable } from "@/components/features/events/events-data-table";
import { createEventsColumns } from "@/components/features/events/events-columns";
import { CreateEventModal } from "@/components/features/events/create-event-modal";
import { ViewEventModal } from "@/components/features/events/view-event-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useOrganizationEventsQuery } from "@/lib/api/queries/eventsQueries";
import { useArchiveEventMutation } from "@/lib/api/mutations/eventsMutations";
import { useAuthStore } from "@/lib/store/authStore";
import { useRouter } from "next/navigation";
import type { Event } from "@/lib/types/entities";

export default function EventsPage() {
  const router = useRouter();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [eventToArchive, setEventToArchive] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { user } = useAuthStore();
  const orgId = user?.orgId;

  const { data, isLoading, error } = useOrganizationEventsQuery(orgId || "", { page, limit });
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

  const handleArchiveConfirm = () => {
    if (eventToArchive) {
      archiveEventMutation.mutate(eventToArchive);
      setShowArchiveDialog(false);
      setEventToArchive(null);
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
      <EventsDataTable
        columns={columns}
        data={events}
        onCreateEvent={() => setIsCreateModalOpen(true)}
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

      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Event?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this event? This action will
              remove it from the active events list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleArchiveCancel}>
              No, keep event
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveConfirm}>
              Yes, archive event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
