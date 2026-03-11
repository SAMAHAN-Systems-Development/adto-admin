import { BASE_URL } from "../../config/api";

// ─── Response Types ───────────────────────────────────────────────

export interface AdminOverviewResponse {
  totalEvents: number;
  upcomingEvents: number;
  ongoingEvents: number;
  draftEvents: number;
}

export interface SuperadminOverviewResponse {
  totalOrganizations: number;
  totalEvents: number;
  upcomingEvents: number;
  ongoingEvents: number;
  draftEvents: number;
}

export interface CalendarEvent {
  id: string;
  name: string;
  dateStart: string;
  dateEnd: string;
  isPublished: boolean;
  org?: {
    id: string;
    name: string;
  };
}

// ─── Service Functions ────────────────────────────────────────────

export const getAdminDashboardOverview =
  async (): Promise<AdminOverviewResponse> => {
    const response = await fetch(`${BASE_URL}/dashboard/admin/overview`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch admin dashboard overview");
    }

    return response.json();
  };

export const getSuperadminDashboardOverview =
  async (): Promise<SuperadminOverviewResponse> => {
    const response = await fetch(`${BASE_URL}/dashboard/superadmin/overview`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch superadmin dashboard overview");
    }

    return response.json();
  };

export const getAdminCalendarEvents = async (
  month: number,
  year: number
): Promise<CalendarEvent[]> => {
  const params = new URLSearchParams({
    month: month.toString(),
    year: year.toString(),
  });

  const response = await fetch(
    `${BASE_URL}/dashboard/admin/calendar?${params}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch admin calendar events");
  }

  return response.json();
};

export const getSuperadminCalendarEvents = async (
  month: number,
  year: number
): Promise<CalendarEvent[]> => {
  const params = new URLSearchParams({
    month: month.toString(),
    year: year.toString(),
  });

  const response = await fetch(
    `${BASE_URL}/dashboard/superadmin/calendar?${params}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch superadmin calendar events");
  }

  return response.json();
};