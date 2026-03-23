import { BASE_URL } from "../../config/api";
import {
  EventRequestQueryParams,
  EventRequestsResponse,
} from "@/lib/types/requests/EventRequestRequests";

export const createEventRequest = async (eventId: string) => {
  const response = await fetch(`${BASE_URL}/event-requests/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ eventId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create event request");
  }
  return await response.json();
};

export const findAllEventRequests = async (
  params?: EventRequestQueryParams
): Promise<EventRequestsResponse> => {
  const url = new URL(`${BASE_URL}/event-requests`);

  if (params?.page) url.searchParams.append("page", String(params.page));
  if (params?.limit) url.searchParams.append("limit", String(params.limit));
  if (params?.status) url.searchParams.append("status", params.status);
  if (params?.searchFilter) url.searchParams.append("searchFilter", params.searchFilter);
  if (params?.organizationId) url.searchParams.append("organizationId", params.organizationId);
  if (params?.eventId) url.searchParams.append("eventId", params.eventId);
  if (params?.orderBy) url.searchParams.append("orderBy", params.orderBy);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch event requests");
  return await response.json();
};

export const findOneEventRequest = async (id: string) => {
  const response = await fetch(`${BASE_URL}/event-requests/find/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch event request");
  return await response.json();
};

export const approveEventRequest = async (id: string) => {
  const response = await fetch(`${BASE_URL}/event-requests/approve/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to approve event request");
  }
  return await response.json();
};

export const declineEventRequest = async (id: string, declineReason: string) => {
  const response = await fetch(`${BASE_URL}/event-requests/decline/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ declineReason }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to decline event request");
  }
  return await response.json();
};

export const cancelEventRequest = async (id: string) => {
  const response = await fetch(`${BASE_URL}/event-requests/cancel/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to cancel event request");
  }
  return await response.json();
};

export const revertEventRequest = async (id: string) => {
  const response = await fetch(`${BASE_URL}/event-requests/revert/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to revert event request");
  }
  return await response.json();
};
