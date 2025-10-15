import { BASE_URL } from "../../config/api";
import type {
  CreateEventRequest,
  UpdateEventRequest,
} from "../../types/requests/EventRequests";

export const findAllPublishedEvents = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const queryParams = new URLSearchParams({
    page: (params?.page || 1).toString(),
    limit: (params?.limit || 20).toString(),
  })
  const response = await fetch(`${BASE_URL}/events/published?${queryParams}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch published events");
  }

  const data = await response.json();
  return data; // Returns { data: [...], meta: { totalCount, totalPages, currentPage, limit } }
};

export const findAllByOrganizationChild = async (orgId: string, params?: {
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
  
  const response = await fetch(`${BASE_URL}/events/organization/${orgId}?${queryParams}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch organization events");
  }

  const data = await response.json();
  return data;
};

export const findOneEvent = async (id: string) => {
  const response = await fetch(`${BASE_URL}/events/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch event");
  }

  const data = await response.json();
  return data;
};

export const publishEvent = async (id: string) => {
  const response = await fetch(`${BASE_URL}/events/${id}/publish`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to publish event");
  }

  const data = await response.json();
  return data;
};

export const updateEvent = async (
  id: string,
  eventData: UpdateEventRequest
) => {
  const response = await fetch(`${BASE_URL}/events/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Failed to update event");
  }

  const data = await response.json();
  return data;
};

export const softDeleteEvent = async (id: string) => {
  const response = await fetch(`${BASE_URL}/events/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete event");
  }

  return response.json();
};

export const archiveEvent = async (id: string) => {
  const response = await fetch(`${BASE_URL}/events/${id}/archive`, {
    method: "PATCH",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Event archive failed");
  }

  const data = await response.json();
  return data;
};

export const createEvent = async (eventData: CreateEventRequest) => {
  const response = await fetch(`${BASE_URL}/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(eventData),
  });

  if (!response.ok) {
    throw new Error("Event create failed");
  }

  const data = await response.json();
  return data;
};
