"use client";

import { useState } from "react";
import { Trash2, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { EventAnnouncement } from "@/lib/types/entities/index";
import { format } from "date-fns";
import { AnnouncementModal } from "@/components/features/announcements/announcement-modal";
import { ConfirmationModal } from "@/components/shared/ConfirmationModal";
import { useDeleteAnnouncementMutation } from "@/lib/api/mutations/announcementsMutations";
interface Props {
  announcement: EventAnnouncement;
  eventId: string;
}

export function AnnouncementItem({ announcement, eventId }: Props) {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const deleteMutation = useDeleteAnnouncementMutation(eventId);

  const formattedDate = format(
    new Date(announcement.updatedAt),
    "'Updated at' MM/dd/yyyy HH:mm"
  );

  const BADGE_CLASS_MAP: Record<string, string> = {
    INFO: "text-blue-700",
    WARNING: "text-yellow-700",
    CANCELLED: "text-red-700",
  };

  const getBadgeClassName = (type: string) =>
    BADGE_CLASS_MAP[type] || "text-gray-700";

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(announcement.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="p-4 flex flex-col md:flex-row md:justify-between gap-3 md:gap-0 min-w-0 rounded-sm">
        {/* Left side - Content */}
        <div className="flex-1 max-w-[600px]">
          {/* Title, Badge, and Timestamp */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {announcement.title}
              </h3>
              <Badge
                variant="default"
                className={`${getBadgeClassName(announcement.announcementType)} text-[0.688rem]`}
              >
                {announcement.announcementType}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 whitespace-nowrap md:ml-auto">
              {formattedDate}
            </p>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 break-words">
            {announcement.content}
          </p>
        </div>

        {/* Right side - Buttons */}
        <div className="flex items-start gap-2 md:ml-4 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-600 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Announcement"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="!h-5 !w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Edit announcement"
            onClick={() => setShowUpdateModal(true)}
          >
            <SquarePen className="!h-5 !w-5" />
          </Button>
        </div>

        {/* Update Modal */}
        <AnnouncementModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
          announcement={{
            ...announcement,
            createdAt: announcement.createdAt.toISOString(),
            updatedAt: announcement.updatedAt.toISOString(),
          }} // passing this triggers edit mode
          eventId={eventId}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Announcement"
        description="Are you sure you want to permanently delete this announcement?"
        confirmText="Yes, delete announcement"
        cancelText="Cancel"
        isLoading={deleteMutation.isPending}
        variant="destructive"
      />
    </>
  );
}
