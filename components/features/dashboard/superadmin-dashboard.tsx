"use client";

import { useSuperadminOverviewQuery } from "@/lib/api/queries/dashboardQueries";
import { OverviewSection } from "./overview-section";
import { EventCalendar } from "./event-calendar";
import { SuperadminQuickActions } from "./superadmin-quick-actions";
import { UserType } from "@/lib/types/user-type";

export function SuperadminDashboard() {
  const { data, isLoading } = useSuperadminOverviewQuery();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
        Welcome, Superadmin
      </h1>

      <SuperadminQuickActions />

      <OverviewSection
        role={UserType.ADMIN}
        data={data}
        isLoading={isLoading}
      />

      <EventCalendar role={UserType.ADMIN} />
    </div>
  );
}
