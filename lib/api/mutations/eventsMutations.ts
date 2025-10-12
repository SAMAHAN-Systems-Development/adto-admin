import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/lib/hooks/use-toast";
import {
  createEvent,
  updateEvent,
  archiveEvent,
  publishEvent,
} from "../services/eventServices";
import type {
  CreateEventRequest,
  UpdateEventRequest,
} from "../../types/requests/EventRequests";

export const useCreateEventMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEventRequest) => createEvent(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event created successfully!",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create event:", error);
    },
  });
};

export const useUpdateEventMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEventRequest }) =>
      updateEvent(id, data),
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: "Event updated successfully!",
        variant: "success",
      });
      // Invalidate both the events list and the specific event query
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update event:", error);
    },
  });
};

export const useArchiveEventMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveEvent,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Event archived successfully!",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to archive event. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to archive event:", error);
    },
  });
};

export const usePublishEventMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publishEvent,
    onSuccess: (_, eventId) => {
      toast({
        title: "Success",
        description: "Event published successfully!",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", eventId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to publish event. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to publish event:", error);
    },
  });
};
