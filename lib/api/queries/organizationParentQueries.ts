import { useQuery } from "@tanstack/react-query";
import {
  findAllOrganizationParents,
  findOneOrganizationParent,
} from "../services/organizationParentServices";

export const useOrganizationParentsQuery = () => {
  return useQuery({
    queryKey: ["organization-parents"],
    queryFn: () => findAllOrganizationParents(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrganizationParentQuery = (id: string) => {
  return useQuery({
    queryKey: ["organization-parents", id],
    queryFn: () => findOneOrganizationParent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
