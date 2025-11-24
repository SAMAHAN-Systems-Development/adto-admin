import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/lib/hooks/use-toast";
import { format } from "date-fns";
import {
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../services/announcementServices";
import type {
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
} from "@/lib/types/requests/AnnouncementRequests";

export const useCreateAnnouncementMutation = (eventId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAnnouncementRequest) => createAnnouncement(data),
    onSuccess: () => {
      const formattedDate = format(new Date(), "EEEE, MMMM d, yyyy");
      toast({
        title: "Announcement has been successfully created",
        description: formattedDate,
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["announcements", "event", eventId],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create announcement. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create announcement:", error);
    },
  });
};

export const useUpdateAnnouncementMutation = (eventId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAnnouncementRequest;
    }) => updateAnnouncement(id, data),
    onSuccess: (_, variables) => {
      const formattedDate = format(new Date(), "EEEE, MMMM d, yyyy");
      toast({
        title: "Announcement details has been successfully updated",
        description: formattedDate,
        variant: "success",
      });
      // Invalidate the list query
      queryClient.invalidateQueries({
        queryKey: ["announcements", "event", eventId],
      });
      // Invalidate individual announcement query
      queryClient.invalidateQueries({
        queryKey: ["announcement", variables.id],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update announcement. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update announcement:", error);
    },
  });
};

export const useDeleteAnnouncementMutation = (eventId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAnnouncement,
    onSuccess: () => {
      const formattedDate = format(new Date(), "EEEE, MMMM d, yyyy");
      toast({
        title: "Announcement has been successfully deleted",
        description: formattedDate,
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["announcements", "event", eventId],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete announcement. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to delete announcement:", error);
    },
  });
};
