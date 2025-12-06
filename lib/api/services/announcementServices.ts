import { BASE_URL } from "../../config/api";
import type {
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  AnnouncementResponse,
} from "@/lib/types/requests/AnnouncementRequests";

export const createAnnouncement = async (
  data: CreateAnnouncementRequest
): Promise<AnnouncementResponse> => {
  const response = await fetch(`${BASE_URL}/event-announcements`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create announcement");
  }

  const res = await response.json();
  return res.data;
};

export const findAllAnnouncementsByEvent = async (
  eventId: string
): Promise<AnnouncementResponse[]> => {
  const response = await fetch(
    `${BASE_URL}/event-announcements?eventId=${eventId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch announcements");
  }

  const res = await response.json();
  return res.data;
};

export const findAnnouncementById = async (
  id: string
): Promise<AnnouncementResponse> => {
  const response = await fetch(`${BASE_URL}/event-announcements/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch announcement");
  }

  const res = await response.json();
  return res.data;
};

export const updateAnnouncement = async (
  id: string,
  data: UpdateAnnouncementRequest
): Promise<AnnouncementResponse> => {
  const response = await fetch(`${BASE_URL}/event-announcements/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update announcement");
  }

  const res = await response.json();
  return res.data;
};

export const deleteAnnouncement = async (id: string) => {
  const response = await fetch(`${BASE_URL}/event-announcements/delete/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to delete announcement");
  }

  return response.json();
};
