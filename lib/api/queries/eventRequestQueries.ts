import { useQuery } from "@tanstack/react-query";
import {
  findAllEventRequests,
  findOneEventRequest,
} from "@/lib/api/services/eventRequestService";
import { EventRequestQueryParams } from "@/lib/types/requests/EventRequestRequests";

export const useEventRequestsQuery = (params?: EventRequestQueryParams) => {
  return useQuery({
    queryKey: [
      "eventRequests",
      params?.page ?? 1,
      params?.limit ?? 10,
      params?.status ?? "",
      params?.searchFilter ?? "",
      params?.organizationId ?? "",
      params?.eventId ?? "",
      params?.orderBy ?? "desc",
    ],
    queryFn: () => findAllEventRequests(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useEventRequestQuery = (id: string) => {
  return useQuery({
    queryKey: ["eventRequest", id],
    queryFn: () => findOneEventRequest(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
