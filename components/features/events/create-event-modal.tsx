"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { EventForm } from "./event-form";
import { useCreateEventMutation } from "@/lib/api/mutations/eventsMutations";
import type { CreateEventRequest } from "@/lib/types/requests/EventRequests";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateEventModal({ isOpen, onClose }: CreateEventModalProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [pendingData, setPendingData] = useState<CreateEventRequest | null>(
    null
  );

  const createEventMutation = useCreateEventMutation();

  const handleSubmit = async (data: CreateEventRequest) => {
    setPendingData(data);
    setShowCreateDialog(true);
    return Promise.resolve();
  };

  const handleCreateConfirm = async () => {
    if (pendingData) {
      await createEventMutation.mutateAsync(pendingData);
      setShowCreateDialog(false);
      setPendingData(null);
      setHasUnsavedChanges(false);
      onClose();
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelDialog(true);
    } else {
      onClose();
    }
  };

  const handleCancelConfirm = () => {
    setShowCancelDialog(false);
    setHasUnsavedChanges(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-600">
              Create Event
            </DialogTitle>
          </DialogHeader>
          <EventForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={createEventMutation.isPending}
            onFormChange={() => setHasUnsavedChanges(true)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        isOpen={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        onConfirm={handleCancelConfirm}
        title="Discard Changes?"
        description="You have unsaved changes. Are you sure you want to discard them?"
        confirmText="Yes, Discard"
        cancelText="No, Keep Editing"
        variant="destructive"
      />

      <ConfirmationModal
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onConfirm={handleCreateConfirm}
        title="Create Event"
        description="Are you sure you want to create this event? You can edit the details later."
        confirmText="Create Event"
        cancelText="Cancel"
        isLoading={createEventMutation.isPending}
        variant="default"
      />
    </>
  );
}
