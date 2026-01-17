import { useQuery } from "@tanstack/react-query";
import {
  findAllPublishedEvents,
  findOneEvent,
} from "../services/eventServices";

export const useEventsQuery = (params?: {
  page?: number;
  limit?: number;
  searchFilter?: string;
  orderBy?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: [
      "events",
      params?.page,
      params?.limit,
      params?.searchFilter,
      params?.orderBy,
    ],
    queryFn: () => findAllPublishedEvents(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useEventQuery = (eventId: string) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: () => findOneEvent(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};
