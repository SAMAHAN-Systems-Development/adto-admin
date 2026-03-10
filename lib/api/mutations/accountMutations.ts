import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/lib/hooks/use-toast";
import { updateMyOrganization } from "../services/accountService";
import type { UpdateOrganizationRequest } from "../../types/requests/OrganizationRequests";

export const useUpdateMyOrganizationMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Omit<UpdateOrganizationRequest, "organizationParentId" | "isAdmin">,
    ) => updateMyOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myOrganization"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update account. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update account:", error);
    },
  });
};
