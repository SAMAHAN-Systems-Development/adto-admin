import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/lib/hooks/use-toast";
import { updateRegistration } from "../services/registrationService";
import { UpdateRegistrationRequest } from "@/lib/types/requests/RegistrationRequest";

export const useUpdateRegistration = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateRegistrationRequest;
    }) => updateRegistration(id, data),
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: "Registration updated successfully!",
        variant: "success",
      });
      // Invalidate both the registrations list and the specific registration query
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({
        queryKey: ["registration", variables.id],
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update registration. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update registration:", error);
    },
  });
};
