import { useQuery } from "@tanstack/react-query";
import { getMyOrganization } from "../services/accountService";

export const useMyOrganizationQuery = () => {
  return useQuery({
    queryKey: ["myOrganization"],
    queryFn: getMyOrganization,
    staleTime: 5 * 60 * 1000,
  });
};
