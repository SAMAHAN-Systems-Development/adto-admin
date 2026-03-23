import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEventRequest,
  approveEventRequest,
  declineEventRequest,
  cancelEventRequest,
  revertEventRequest,
} from "@/lib/api/services/eventRequestService";

export const useCreateEventRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: string) => createEventRequest(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventRequests"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
};

export const useApproveEventRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveEventRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventRequests"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
};

export const useDeclineEventRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, declineReason }: { id: string; declineReason: string }) =>
      declineEventRequest(id, declineReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventRequests"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
};

export const useCancelEventRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => cancelEventRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventRequests"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
};

export const useRevertEventRequestMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => revertEventRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventRequests"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
};
