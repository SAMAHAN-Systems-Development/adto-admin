import { BASE_URL } from "../../config/api";
import type { CreateEventRequest } from "../../types/requests/CreateEventRequest";

export const createEventService = async (eventData: CreateEventRequest) => {
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
