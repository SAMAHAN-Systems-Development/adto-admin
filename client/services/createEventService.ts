import { BASE_URL } from "../config";
import type { CreateEventDto } from "../types/dto/create-event.type";

export const createEventService = async (eventData: CreateEventDto) => {
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
