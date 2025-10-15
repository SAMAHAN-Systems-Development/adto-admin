import { useQuery } from "@tanstack/react-query";
import {
  findAllOrganizations,
  findOneOrganization,
  findAllOrganizationsWithoutFilters,
  findAllByOrganizationParent,
} from "../services/organizationServices";

export const useOrganizationsQuery = (params?: {
  page?: number;
  limit?: number;
  searchFilter?: string;
  orderBy?: "asc" | "desc";
}) => {
  return useQuery({
    queryKey: [
      "organizations",
      params?.page,
      params?.limit,
      params?.searchFilter,
      params?.orderBy,
    ],
    queryFn: () => findAllOrganizations(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrganizationsWithoutFiltersQuery = () => {
  return useQuery({
    queryKey: ["organizations", "all"],
    queryFn: () => findAllOrganizationsWithoutFilters(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrganizationParentChildrenQuery = (
  parentId: string,
  params?: {
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: [
      "organizations",
      "parent",
      parentId,
      params?.page,
      params?.limit,
    ],
    queryFn: () => findAllByOrganizationParent(parentId, params),
    enabled: !!parentId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrganizationQuery = (organizationId: string) => {
  return useQuery({
    queryKey: ["organization", organizationId],
    queryFn: () => findOneOrganization(organizationId),
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000,
  });
};
