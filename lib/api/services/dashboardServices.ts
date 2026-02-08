import { BASE_URL } from "../../config/api";

export interface DashboardOverviewResponse {
  totalOrganizations: number;
  upcomingEvents: number;
}

export const getDashboardOverview =
  async (): Promise<DashboardOverviewResponse> => {
    const response = await fetch(`${BASE_URL}/dashboard/overview`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard overview");
    }

    const data = await response.json();
    return data;
  };