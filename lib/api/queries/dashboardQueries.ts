import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "../services/dashboardServices";

export const useDashboardOverviewQuery = () => {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: getDashboardOverview,
    staleTime: 60 * 1000, // 1 minute
  });
};
