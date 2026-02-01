// TODO: Connect to backend dashboard overview endpoint

export interface DashboardOverviewResponse {
  totalOrganizations: number;
  upcomingEvents: number;
}

export const getDashboardOverview =
  async (): Promise<DashboardOverviewResponse> => {
    // Temp mock data
    return {
      totalOrganizations: 13,
      upcomingEvents: 6,
    };
  };
