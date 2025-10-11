import { useQuery } from "@tanstack/react-query";
import {
  findAllPublishedEvents,
  findOneEvent,
  findAllByOrganizationChild,
} from "../services/eventServices";

export const useEventsQuery = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["events", params?.page, params?.limit],
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

export const useOrganizationEventsQuery = (orgId: string, params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ["events", "organization", orgId, params?.page, params?.limit],
    queryFn: () => findAllByOrganizationChild(orgId, params),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
  });
};
