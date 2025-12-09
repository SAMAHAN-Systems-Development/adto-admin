import { useQuery } from "@tanstack/react-query";
import { findAllTicketEvents, findOneEventTicket } from "@/lib/api/services/ticketService";

interface QueryParams {
  page?: number;
  limit?: number;
  searchFilter?: string;
  orderBy?: "asc" | "desc";
  eventId?: string;
}

// Fetch all tickets
export const useEventTicketsQuery = (params?: QueryParams) => {
  return useQuery({
    queryKey: [
      "eventTickets",
      params?.eventId ?? "",
      params?.page ?? 1,
      params?.limit ?? 10,
      params?.searchFilter ?? "",
      params?.orderBy ?? "asc",
    ],
    queryFn: () => findAllTicketEvents(params?.eventId),
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch single ticket
export const useEventTicketQuery = (ticketId: string) => {
  return useQuery({
    queryKey: ["eventTicket", ticketId],
    queryFn: () => findOneEventTicket(ticketId),
    enabled: !!ticketId,
    staleTime: 5 * 60 * 1000,
  });
};
