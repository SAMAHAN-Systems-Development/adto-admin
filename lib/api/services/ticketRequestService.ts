import { BASE_URL } from "../../config/api";
import {
  TicketRequestQueryParams,
  TicketRequestsResponse,
} from "@/lib/types/requests/TicketRequestRequests";

export const createTicketRequest = async (ticketId: string) => {
  const response = await fetch(`${BASE_URL}/ticket-requests/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ticketId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create ticket request");
  }

  return await response.json();
};

export const findAllTicketRequests = async (
  params?: TicketRequestQueryParams
): Promise<TicketRequestsResponse> => {
  const url = new URL(`${BASE_URL}/ticket-requests`);

  if (params?.page) url.searchParams.append("page", String(params.page));
  if (params?.limit) url.searchParams.append("limit", String(params.limit));
  if (params?.status) url.searchParams.append("status", params.status);
  if (params?.searchFilter)
    url.searchParams.append("searchFilter", params.searchFilter);
  if (params?.organizationId)
    url.searchParams.append("organizationId", params.organizationId);
  if (params?.orderBy) url.searchParams.append("orderBy", params.orderBy);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch ticket requests");

  return await response.json();
};

export const findOneTicketRequest = async (id: string) => {
  const response = await fetch(`${BASE_URL}/ticket-requests/find/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) throw new Error("Failed to fetch ticket request");

  return await response.json();
};

export const approveTicketRequest = async (
  id: string,
  ticketLink: string,
  helixpayUsername?: string,
  helixpayPassword?: string,
  messengerLink?: string
) => {
  const response = await fetch(`${BASE_URL}/ticket-requests/approve/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ ticketLink, helixpayUsername, helixpayPassword, messengerLink }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to approve ticket request");
  }

  return await response.json();
};

export const declineTicketRequest = async (
  id: string,
  declineReason: string
) => {
  const response = await fetch(`${BASE_URL}/ticket-requests/decline/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ declineReason }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to decline ticket request");
  }

  return await response.json();
};

export const cancelTicketRequest = async (id: string) => {
  const response = await fetch(`${BASE_URL}/ticket-requests/cancel/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to cancel ticket request");
  }

  return await response.json();
};

export const revertTicketRequest = async (id: string) => {
  const response = await fetch(`${BASE_URL}/ticket-requests/revert/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to revert ticket request");
  }

  return await response.json();
};
