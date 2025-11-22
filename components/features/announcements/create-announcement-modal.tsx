"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { AnnouncementForm } from "./announcement-form";
import { useCreateAnnouncementMutation } from "@/lib/api/mutations/announcementsMutations";
import type { AnnouncementFormRequest } from "@/lib/types/requests/AnnouncementRequests";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
}

export function CreateAnnouncementModal({ isOpen, onClose, eventId }: Props) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [pendingData, setPendingData] =
    useState<AnnouncementFormRequest | null>(null);

  const createAnnouncementMutation = useCreateAnnouncementMutation(eventId);

  const handleSubmit = async (data: AnnouncementFormRequest) => {
    setPendingData(data);
    setShowCreateDialog(true);
  };

  const handleCreateConfirm = async () => {
    if (pendingData) {
      await createAnnouncementMutation.mutateAsync({
        ...pendingData,
        eventId,
      });
      setShowCreateDialog(false);
      setPendingData(null);
      onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-600 text-2xl mb-2">
              Create Announcement
            </DialogTitle>
          </DialogHeader>
          <AnnouncementForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={createAnnouncementMutation.isPending}
            isEditMode={false}
          />
        </DialogContent>
      </Dialog>

      {/* Confirmation Popup */}
      <ConfirmationModal
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onConfirm={handleCreateConfirm}
        title="Create Announcement"
        description="Are you sure you want to create this announcement?"
        confirmText="Create Announcement"
        cancelText="Cancel"
        isLoading={createAnnouncementMutation.isPending}
        variant="default"
      />
    </>
  );
}
