"use client";

import { useAdminOverviewQuery } from "@/lib/api/queries/dashboardQueries";
import { OverviewSection } from "./overview-section";
import { EventCalendar } from "./event-calendar";
import { AdminQuickActions } from "./admin-quick-actions";
import { UserType } from "@/lib/types/user-type";

export function AdminDashboard() {
  const { data, isLoading } = useAdminOverviewQuery();

  const greeting = isLoading
    ? "Welcome back"
    : `Welcome back, ${data?.orgName || "Organization"}`;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
        {greeting}
      </h1>

      <AdminQuickActions />
      
      <OverviewSection
        role={UserType.ORGANIZATION}
        data={data}
        isLoading={isLoading}
      />
      
      <EventCalendar role={UserType.ORGANIZATION} />
    </div>
  );
}
