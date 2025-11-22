"use client";

import { useAnnouncementsByEventQuery } from "@/lib/api/queries/announcementsQueries";
import { AnnouncementItem } from "./announcement-item";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  eventId: string;
}

export function AnnouncementList({ eventId }: Props) {
  const {
    data: announcements,
    isLoading,
    error,
  } = useAnnouncementsByEventQuery(eventId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Failed to load announcements. Please try again.
      </div>
    );
  }

  if (!announcements || announcements.length === 0) {
    return (
      <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
        No announcements yet. Create one to get started!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {announcements.map((announcement) => (
        <AnnouncementItem key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
}
