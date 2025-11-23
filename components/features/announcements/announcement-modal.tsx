"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { AnnouncementForm } from "@/components/features/announcements/announcement-form";
import type {
  AnnouncementFormRequest,
  AnnouncementResponse,
} from "@/lib/types/requests/AnnouncementRequests";
import {
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from "@/lib/api/mutations/announcementsMutations";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  announcement?: AnnouncementResponse | null;
}

export function AnnouncementModal({
  isOpen,
  onClose,
  eventId,
  announcement,
}: Props) {
  const isEditMode = Boolean(announcement);

  const [pendingData, setPendingData] =
    useState<AnnouncementFormRequest | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const createMutation = useCreateAnnouncementMutation(eventId);
  const updateMutation = useUpdateAnnouncementMutation(eventId);

  useEffect(() => {
    if (!isOpen) {
      setPendingData(null);
      setShowConfirmDialog(false);
    }
  }, [isOpen]);

  const handleSubmit = async (data: AnnouncementFormRequest) => {
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirm = async () => {
    if (!pendingData) return;

    if (isEditMode && announcement) {
      await updateMutation.mutateAsync({
        id: announcement.id,
        data: pendingData,
      });
    } else {
      await createMutation.mutateAsync({
        ...pendingData,
        eventId,
      });
    }

    setPendingData(null);
    setShowConfirmDialog(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-white sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-blue-600 text-2xl mb-2">
              {isEditMode ? "Update Announcement" : "Create Announcement"}
            </DialogTitle>
          </DialogHeader>

          <AnnouncementForm
            onSubmit={handleSubmit}
            onCancel={onClose}
            isLoading={
              isEditMode ? updateMutation.isPending : createMutation.isPending
            }
            initialData={
              announcement
                ? {
                    title: announcement.title,
                    content: announcement.content,
                    announcementType: announcement.announcementType,
                  }
                : undefined
            } // <- undefined, not null
            isEditMode={isEditMode}
          />
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirm}
        title={isEditMode ? "Update Announcement" : "Create Announcement"}
        description={`Are you sure you want to ${
          isEditMode ? "update" : "create"
        } this announcement?`}
        confirmText={isEditMode ? "Update Announcement" : "Create Announcement"}
        cancelText="Cancel"
        isLoading={
          isEditMode ? updateMutation.isPending : createMutation.isPending
        }
        variant="default"
      />
    </>
  );
}
