import { BASE_URL } from "../../config/api";
import type { UpdateRegistrationRequest } from "../../types/requests/RegistrationRequest";
import type { Registration } from "../../types/entities";

interface RegistrationsQueryParams {
  page?: number;
  limit?: number;
  searchFilter?: string;
  orderBy?: "asc" | "desc";
}

interface RegistrationsResponse {
  data: Registration[];
  meta?: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export const findAllRegistrationsByEvent = async (
  eventId: string,
  params?: RegistrationsQueryParams
): Promise<RegistrationsResponse> => {
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

  const data: RegistrationsResponse = await response.json();
  return data; // Returns { data: [...], meta: { totalCount, totalPages, currentPage, limit } }
};

export const findAllRegistrationsByEventForExport = async (
  eventId: string,
): Promise<Registration[]> => {
  const allRegistrations: Registration[] = [];
  const exportLimit = 200;
  let currentPage = 1;
  let totalPages = 1;

  do {
    const response = await findAllRegistrationsByEvent(eventId, {
      page: currentPage,
      limit: exportLimit,
    });

    if (!Array.isArray(response.data)) {
      break;
    }

    allRegistrations.push(...response.data);
    totalPages = response.meta?.totalPages ?? 1;
    currentPage += 1;
  } while (currentPage <= totalPages);

  return allRegistrations;
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

export const deleteRegistration = async (id: string) => {
  const response = await fetch(`${BASE_URL}/registrations/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete registration");
  }

  return await response.json();
};
