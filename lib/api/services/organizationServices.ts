import { BASE_URL } from "../../config/api";
import type { CreateOrganizationRequest } from "../../types/requests/OrganizationRequests";

export const findAllOrganizations = async (params?: {
  page?: number;
  limit?: number;
  searchFilter?: string;
  orderBy?: "asc" | "desc";
}) => {
  const queryParams = new URLSearchParams({
    page: (params?.page || 1).toString(),
    limit: (params?.limit || 20).toString(),
  });

  if (params?.searchFilter) {
    queryParams.append("searchFilter", params.searchFilter);
  }
  if (params?.orderBy) {
    queryParams.append("orderBy", params.orderBy);
  }

  const response = await fetch(`${BASE_URL}/organizations?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }

  const data = await response.json();
  return data; // Returns { data: [...], meta: { totalCount, totalPages, currentPage, limit } }
};

export const findAllOrganizationsWithoutFilters = async () => {
  const response = await fetch(`${BASE_URL}/organizations/all`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organizations");
  }

  const data = await response.json();
  return data;
};

export const findAllByOrganizationParent = async (
  parentId: string,
  params?: {
    page?: number;
    limit?: number;
  }
) => {
  const queryParams = new URLSearchParams({
    page: (params?.page || 1).toString(),
    limit: (params?.limit || 20).toString(),
  });

  const response = await fetch(
    `${BASE_URL}/organizations/organizationParent/${parentId}?${queryParams}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch organization parent's children");
  }

  const data = await response.json();
  return data;
};

export const findOneOrganization = async (id: string) => {
  const response = await fetch(`${BASE_URL}/organizations/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organization");
  }

  const data = await response.json();
  return data;
};

export const createOrganization = async (
  orgData: CreateOrganizationRequest
) => {
  const response = await fetch(`${BASE_URL}/organizations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(orgData),
  });

  if (!response.ok) {
    throw new Error("Organization create failed");
  }

  const data = await response.json();
  return data;
};

export const updateOrganization = async (
  id: string,
  orgData: Partial<CreateOrganizationRequest>
) => {
  const response = await fetch(`${BASE_URL}/organizations/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(orgData),
  });

  if (!response.ok) {
    throw new Error("Organization update failed");
  }

  const data = await response.json();
  return data;
};

export const uploadOrganizationIcon = async (id: string, icon: File) => {
  const formData = new FormData();
  formData.append("icon", icon);

  const response = await fetch(`${BASE_URL}/organizations/uploadIcon/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload organization icon");
  }

  const data = await response.json();
  return data;
};

export const archiveOrganization = async (id: string) => {
  const response = await fetch(`${BASE_URL}/organizations/${id}/archive`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Organization archive failed");
  }

  const data = await response.json();
  return data;
};

export const unarchiveOrganization = async (id: string) => {
  const response = await fetch(`${BASE_URL}/organizations/${id}/unarchive`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Organization unarchive failed");
  }

  const data = await response.json();
  return data;
};
