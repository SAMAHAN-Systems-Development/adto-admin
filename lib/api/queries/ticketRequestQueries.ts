import { useQuery } from "@tanstack/react-query";
import {
  findAllTicketRequests,
  findOneTicketRequest,
} from "@/lib/api/services/ticketRequestService";
import { TicketRequestQueryParams } from "@/lib/types/requests/TicketRequestRequests";

export const useTicketRequestsQuery = (params?: TicketRequestQueryParams) => {
  return useQuery({
    queryKey: [
      "ticketRequests",
      params?.page ?? 1,
      params?.limit ?? 10,
      params?.status ?? "",
      params?.searchFilter ?? "",
      params?.organizationId ?? "",
      params?.orderBy ?? "desc",
    ],
    queryFn: () => findAllTicketRequests(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTicketRequestQuery = (id: string) => {
  return useQuery({
    queryKey: ["ticketRequest", id],
    queryFn: () => findOneTicketRequest(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
