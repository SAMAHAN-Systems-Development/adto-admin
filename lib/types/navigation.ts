import { LayoutDashboard, CalendarIcon, FileLineChart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface RouteConfig {
  path: string;
  name: string;
  icon: LucideIcon;
}

export const mainRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/organizations",
    name: "Organizations",
    icon: FileLineChart,
  },
  {
    path: "/events",
    name: "My Events",
    icon: CalendarIcon,
  },
];
