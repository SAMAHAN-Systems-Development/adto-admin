import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTicketRequest,
  approveTicketRequest,
  declineTicketRequest,
  cancelTicketRequest,
  revertTicketRequest,
} from "@/lib/api/services/ticketRequestService";

export const useCreateTicketRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ticketId: string) => createTicketRequest(ticketId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketRequests"] });
      queryClient.invalidateQueries({ queryKey: ["eventTickets"] });
    },
  });
};

export const useApproveTicketRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ticketLink }: { id: string; ticketLink: string }) =>
      approveTicketRequest(id, ticketLink),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketRequests"] });
      queryClient.invalidateQueries({ queryKey: ["eventTickets"] });
    },
  });
};

export const useDeclineTicketRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      declineReason,
    }: {
      id: string;
      declineReason: string;
    }) => declineTicketRequest(id, declineReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketRequests"] });
      queryClient.invalidateQueries({ queryKey: ["eventTickets"] });
    },
  });
};

export const useCancelTicketRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelTicketRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketRequests"] });
      queryClient.invalidateQueries({ queryKey: ["eventTickets"] });
    },
  });
};

export const useRevertTicketRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => revertTicketRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticketRequests"] });
      queryClient.invalidateQueries({ queryKey: ["eventTickets"] });
    },
  });
};
