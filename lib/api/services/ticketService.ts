import { BASE_URL } from "../../config/api";
import { CreateEventTicketRequest } from "@/lib/types/requests/ticketsRequests";

export const findAllTicketEvents = async (eventId?: string) => {
  const url = new URL(`${BASE_URL}/tickets`);
  if (eventId) {
    url.searchParams.append('eventId', eventId);
  }

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  if (!response.ok) throw new Error("Failed to fetch ticket events");

  return await response.json();
};

export const findOneEventTicket = async (id: string) => {
  const response = await fetch(`${BASE_URL}/tickets/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include"
  });

  if (!response.ok) throw new Error("Failed to fetch ticket");

  return await response.json();
};

export const createEventTicket = async (ticketData: CreateEventTicketRequest) => {
  const formattedData = {
    ...ticketData,
    registrationDeadline: new Date(ticketData.registrationDeadline).toISOString()
  };

  const response = await fetch(`${BASE_URL}/tickets/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(formattedData)
  });

  if (!response.ok) throw new Error("Failed to create a ticket");

  return await response.json();
};

export const updateEventTicket = async (
  id: string,
  ticketData: Partial<CreateEventTicketRequest>
) => {
  const response = await fetch(`${BASE_URL}/tickets/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(ticketData)
  });

  if (!response.ok) throw new Error("Failed to update a ticket");

  return await response.json();
};

// DELETE
export const deleteEventTicket = async (id: string) => {
  const response = await fetch(`${BASE_URL}/tickets/delete/${id}`, {
    method: "DELETE",
    credentials: "include"
  });

  if (!response.ok) throw new Error("Event ticket delete failed");

  return await response.json();
};
