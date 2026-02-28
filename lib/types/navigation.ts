import { LayoutDashboard, CalendarIcon, FileLineChart } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { UserType } from "./user-type";

export interface RouteConfig {
  path: string;
  name: string;
  icon: LucideIcon;
  allowedRoles?: UserType[]; // If undefined, all authenticated users can access
}

export const mainRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
    // No allowedRoles = accessible to all authenticated users
  },
  {
    path: "/organizations",
    name: "Organizations",
    icon: FileLineChart,
    allowedRoles: [UserType.ADMIN], // Only Admin can see this route
  },
  {
    path: "/events",
    name: "My Events",
    icon: CalendarIcon,
  },
];