import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createEventTicket,
  updateEventTicket,
  deleteEventTicket,
} from "@/lib/api/services/ticketService";
import { CreateEventTicketRequest } from "@/lib/types/requests/ticketsRequests";

// CREATE
// export const useCreateEventTicketMutation = (setTickets: any) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (data: CreateEventTicketRequest) => {
//       console.log("🚀 Mutation function called with:", data);
//       return createEventTicket(data);
//     },
//     onSuccess: (newTicket) => {
//       console.log("✅ Mutation onSuccess - new ticket:", newTicket);
      
//       // Add to local state
//       setTickets((prev: any) => {
//         console.log("📝 Previous tickets:", prev);
//         const updated = [...prev, newTicket];
//         console.log("📝 Updated tickets:", updated);
//         return updated;
//       });
      
//       // Invalidate queries
//       queryClient.invalidateQueries({ queryKey: ["eventTickets"] });
//     },
//     onError: (error: any) => {
//       console.error("❌ Mutation error:", error);
//       console.error("❌ Error details:", error.message);
//       console.error("❌ Full error:", JSON.stringify(error, null, 2));
//     },
//   });
// };

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
export const useUpdateEventTicketMutation = (onUndo?: (oldTicket: any) => void) => {
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
    onError: (error: any) => {
      console.error("❌ Update error:", error);
    },
  });
};

// DELETE
export const useDeleteEventTicketMutation = (setTickets?: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      console.log("🚀 Delete mutation called - ID:", id);
      return deleteEventTicket(id);
    },
    onSuccess: (_, id) => {
      console.log("✅ Delete success for ID:", id);
      if (setTickets) {
        setTickets((prev: any) => prev.filter((t: any) => t.id !== id));
      }
      queryClient.invalidateQueries({ queryKey: ["eventTickets"] });
      queryClient.invalidateQueries({ queryKey: ["eventTicket", id] });
    },
    onError: (error: any) => {
      console.error("❌ Delete error:", error);
    },
  });
};