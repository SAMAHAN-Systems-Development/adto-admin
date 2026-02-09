import { BASE_URL } from "../../config/api";
import type { CreateOrganizationParentRequest, UpdateOrganizationParentRequest } from "../../types/requests/OrganizationParentRequests";

export const findAllOrganizationParents = async () => {
  const response = await fetch(`${BASE_URL}/organization-parents`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organization parents");
  }

  const data = await response.json();
  return data;
};

export const findOneOrganizationParent = async (id: string) => {
  const response = await fetch(`${BASE_URL}/organization-parents/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organization parent");
  }

  const data = await response.json();
  return data;
};

export const createOrganizationParent = async (
  data: CreateOrganizationParentRequest
) => {
  const response = await fetch(`${BASE_URL}/organization-parents/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create organization parent");
  }

  const result = await response.json();
  return result;
};

export const updateOrganizationParent = async (
  id: string,
  data: UpdateOrganizationParentRequest
) => {
  const response = await fetch(`${BASE_URL}/organization-parents/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update organization parent");
  }

  const result = await response.json();
  return result;
};

export const deleteOrganizationParent = async (id: string) => {
  const response = await fetch(`${BASE_URL}/organization-parents/remove/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete organization parent");
  }

  const result = await response.json();
  return result;
};

