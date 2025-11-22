"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { AnnouncementForm } from "./announcement-form";
import { useUpdateAnnouncementMutation } from "@/lib/api/mutations/announcementsMutations";
import type {
  AnnouncementFormRequest,
  AnnouncementResponse,
} from "@/lib/types/requests/AnnouncementRequests";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  announcement: AnnouncementResponse | null;
  eventId: string;
}

export function UpdateAnnouncementModal({
  isOpen,
  onClose,
  announcement,
  eventId,
}: Props) {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [pendingData, setPendingData] =
    useState<AnnouncementFormRequest | null>(null);

  const updateAnnouncementMutation = useUpdateAnnouncementMutation(eventId);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPendingData(null);
      setShowUpdateDialog(false);
    }
  }, [isOpen]);

  const handleSubmit = async (data: AnnouncementFormRequest) => {
    setPendingData(data);
    setShowUpdateDialog(true);
  };

  const handleUpdateConfirm = async () => {
    if (pendingData && announcement) {
      await updateAnnouncementMutation.mutateAsync({
        id: announcement.id,
        data: pendingData,
      });
      setShowUpdateDialog(false);
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
              Update Announcement
            </DialogTitle>
          </DialogHeader>
          {announcement && (
            <AnnouncementForm
              onSubmit={handleSubmit}
              onCancel={onClose}
              isLoading={updateAnnouncementMutation.isPending}
              initialData={{
                announcementType: announcement.announcementType,
                title: announcement.title,
                content: announcement.content,
              }}
              isEditMode={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Popup */}
      <ConfirmationModal
        isOpen={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        onConfirm={handleUpdateConfirm}
        title="Update Announcement"
        description="Are you sure you want to update this announcement?"
        confirmText="Update Announcement"
        cancelText="Cancel"
        isLoading={updateAnnouncementMutation.isPending}
        variant="default"
      />
    </>
  );
}
