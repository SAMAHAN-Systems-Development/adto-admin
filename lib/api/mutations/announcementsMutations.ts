import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/lib/hooks/use-toast";
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
      toast({
        title: "Success",
        description: "Announcement created successfully!",
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
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Announcement updated successfully!",
        variant: "success",
      });
      queryClient.invalidateQueries({
        queryKey: ["announcements", "event", eventId],
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
      toast({
        title: "Success",
        description: "Announcement deleted successfully!",
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
