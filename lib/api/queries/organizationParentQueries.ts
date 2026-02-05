import { useQuery } from "@tanstack/react-query";
import { findAllOrganizationParents } from "../services/organizationParentServices";

export const useOrganizationParentsQuery = () => {
  return useQuery({
    queryKey: ["organization-parents"],
    queryFn: () => findAllOrganizationParents(),
    staleTime: 5 * 60 * 1000,
  });
};
