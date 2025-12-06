import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createEventTicket,
  updateEventTicket,
  deleteEventTicket,
} from "@/lib/api/services/ticketService";
import { CreateEventTicketRequest } from "@/lib/types/requests/ticketsRequests";

export const useCreateEventTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventTicketRequest) => createEventTicket(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventTickets"] })
    }
  })
}

// UPDATE
export const useUpdateEventTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEventTicketRequest> }) => {
      console.log("🚀 Update mutation called - ID:", id, "Data:", data);
      return updateEventTicket(id, data);
    },
    onSuccess: (updatedTicket, variables) => {
      console.log("✅ Update success:", updatedTicket);
      queryClient.invalidateQueries({ queryKey: ["eventTickets"] });
      queryClient.invalidateQueries({ queryKey: ["eventTicket", variables.id] });
    },
    onError: (error) => {
      console.error("❌ Update error:", error);
    },
  });
};

// DELETE
export const useDeleteEventTicketMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      console.log("🚀 Delete mutation called - ID:", id);
      return deleteEventTicket(id);
    },
    onSuccess: (_, id) => {
      console.log("✅ Delete success for ID:", id);
      queryClient.invalidateQueries({ queryKey: ["eventTickets"] });
      queryClient.invalidateQueries({ queryKey: ["eventTicket", id] });
    },
    onError: (error) => {
      console.error("❌ Delete error:", error);
    },
  });
};