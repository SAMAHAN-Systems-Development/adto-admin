import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { OrganizationChild } from "../types/entities";
import { addOrganization } from "../services/createOrganizationService";
import organizationSchema from "@/client/schemas/organization-schema";
import { z } from "zod";

export const useAddOrganization = (
  mutationOptions: UseMutationOptions<
    OrganizationChild,
    Error,
    z.infer<typeof organizationSchema>
  >,
) =>
  useMutation({
    mutationFn: (organizationData) => addOrganization(organizationData),
    ...mutationOptions,
  });
