import { useQuery } from "@tanstack/react-query";
import {
  getAdminDashboardOverview,
  getSuperadminDashboardOverview,
  getAdminCalendarEvents,
  getSuperadminCalendarEvents,
} from "../services/dashboardServices";

export const useAdminOverviewQuery = () => {
  return useQuery({
    queryKey: ["admin-dashboard-overview"],
    queryFn: getAdminDashboardOverview,
    staleTime: 60 * 1000,
  });
};

export const useSuperadminOverviewQuery = () => {
  return useQuery({
    queryKey: ["superadmin-dashboard-overview"],
    queryFn: getSuperadminDashboardOverview,
    staleTime: 60 * 1000,
  });
};

export const useAdminCalendarQuery = (month: number, year: number) => {
  return useQuery({
    queryKey: ["admin-calendar", month, year],
    queryFn: () => getAdminCalendarEvents(month, year),
    staleTime: 60 * 1000,
  });
};

export const useSuperadminCalendarQuery = (month: number, year: number) => {
  return useQuery({
    queryKey: ["superadmin-calendar", month, year],
    queryFn: () => getSuperadminCalendarEvents(month, year),
    staleTime: 60 * 1000,
  });
};
