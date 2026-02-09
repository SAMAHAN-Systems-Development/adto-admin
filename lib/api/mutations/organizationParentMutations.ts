import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganizationParent, updateOrganizationParent, deleteOrganizationParent } from "../services/organizationParentServices";
import type { CreateOrganizationParentRequest, UpdateOrganizationParentRequest } from "../../types/requests/OrganizationParentRequests";

export const useCreateOrganizationParentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganizationParentRequest) =>
      createOrganizationParent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-parents"] });
    },
  });
};

export const useUpdateOrganizationParentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrganizationParentRequest }) =>
      updateOrganizationParent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-parents"] });
    },
  });
};

export const useDeleteOrganizationParentMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrganizationParent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-parents"] });
    },
  });
};
