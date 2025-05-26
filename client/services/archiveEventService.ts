import { BASE_URL } from "../config";

export const archiveEventService = async (id: string) => {
  const response = await fetch(`${BASE_URL}/events/${id}/archive`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Event archive failed");
  }

  const data = await response.json();
  return data;
};
