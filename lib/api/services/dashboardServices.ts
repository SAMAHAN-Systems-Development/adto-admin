import { BASE_URL } from "../../config/api";

export interface DashboardOverviewResponse {
  totalOrganizations: number;
  upcomingEvents: number;
}

// Temporary mock toggle
const USE_MOCK = true;

export const getDashboardOverview =
  async (): Promise<DashboardOverviewResponse> => {
    if (USE_MOCK) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      return {
        totalOrganizations: 13,
        upcomingEvents: 6,
      };
    }

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
