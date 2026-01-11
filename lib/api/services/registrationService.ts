import { BASE_URL } from "../../config/api";
import type { UpdateRegistrationRequest } from "../../types/requests/RegistrationRequest";

export const findAllRegistrationsByEvent = async (
  eventId: string,
  params?: {
    page?: number;
    limit?: number;
    searchFilter?: string;
    orderBy?: "asc" | "desc";
  }
) => {
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
  const response = await fetch(
    `${BASE_URL}/registrations/event/${eventId}?${queryParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch registrations");
  }

  const data = await response.json();
  return data; // Returns { data: [...], meta: { totalCount, totalPages, currentPage, limit } }
};

export const findOneRegistration = async (id: string) => {
  const response = await fetch(`${BASE_URL}/registrations/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch registration");
  }

  const data = await response.json();
  return data;
};

export const updateRegistration = async (
  id: string,
  registrationData: UpdateRegistrationRequest
) => {
  const response = await fetch(`${BASE_URL}/registrations/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(registrationData),
  });

  if (!response.ok) {
    throw new Error("Failed to update registration");
  }

  const data = await response.json();
  return data;
};
