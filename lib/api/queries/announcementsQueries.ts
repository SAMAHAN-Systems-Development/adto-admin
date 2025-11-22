import { useQuery } from "@tanstack/react-query";
import { findAllAnnouncementsByEvent } from "../services/announcementServices";

export const useAnnouncementsByEventQuery = (eventId: string) => {
  return useQuery({
    queryKey: ["announcements", "event", eventId],
    queryFn: async () => {
      const announcements = await findAllAnnouncementsByEvent(eventId);
      // Sort announcements by createdAt in DESC order (newest first)
      return announcements.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};
