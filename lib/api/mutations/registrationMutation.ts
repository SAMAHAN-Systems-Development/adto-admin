import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/lib/hooks/use-toast";
import { updateRegistration } from "../services/registrationService";
import { UpdateRegistrationRequest } from "@/lib/types/requests/RegistrationRequest";
import { Registration } from "@/lib/types/entities";

interface RegistrationsQueryData {
  data: Registration[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

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
    onMutate: async (variables) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["registrations"] });

      // Snapshot all current registrations queries for rollback
      const previousQueries: [
        readonly unknown[],
        RegistrationsQueryData | undefined,
      ][] = [];

      queryClient.getQueriesData<RegistrationsQueryData>({
        queryKey: ["registrations"],
      }).forEach(([queryKey, data]) => {
        previousQueries.push([queryKey, data]);
      });

      // Optimistically update the registration in all matching queries
      queryClient.setQueriesData<RegistrationsQueryData>(
        { queryKey: ["registrations"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((registration) =>
              registration.id === variables.id
                ? { ...registration, ...variables.data }
                : registration,
            ),
          };
        },
      );

      return { previousQueries };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Registration updated successfully!",
        variant: "success",
      });
    },
    onError: (error, variables, context) => {
      // Rollback to the previous state on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast({
        title: "Error",
        description: "Failed to update registration. Please try again.",
        variant: "destructive",
      });
      console.error("Failed to update registration:", error);
    },
    onSettled: (_, __, variables) => {
      // Always refetch after success or error to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
      queryClient.invalidateQueries({
        queryKey: ["registration", variables.id],
      });
    },
  });
};
