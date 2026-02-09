import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/lib/hooks/use-toast";
import {
  createOrganization,
  updateOrganization,
  archiveOrganization,
  unarchiveOrganization,
  uploadOrganizationIcon,
} from "../services/organizationServices";
import type {
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
} from "../../types/requests/OrganizationRequests";

export const useCreateOrganizationMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationRequest) => createOrganization(data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Organization created successfully!",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization-parents"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create organization. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to create organization:", error);
    },
  });
};

export const useUpdateOrganizationMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateOrganizationRequest;
    }) => updateOrganization(id, data),
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: "Organization updated successfully!",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["organization-parents"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update organization. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update organization:", error);
    },
  });
};

export const useUploadOrganizationIconMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, icon }: { id: string; icon: File }) =>
      uploadOrganizationIcon(id, icon),
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: "Organization icon uploaded successfully!",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization", variables.id],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to upload organization icon. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to upload organization icon:", error);
    },
  });
};

export const useArchiveOrganizationMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveOrganization,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Organization archived successfully!",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization-parents"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to archive organization. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to archive organization:", error);
    },
  });
};

export const useUnarchiveOrganizationMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unarchiveOrganization,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Organization unarchived successfully!",
        variant: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organization-parents"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to unarchive organization. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to unarchive organization:", error);
    },
  });
};
