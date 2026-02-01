"use client";

import { useDashboardOverviewQuery } from "@/lib/api/queries/dashboardQueries";
import { StatCard } from "./stat-card";

export function OverviewSection() {
  const { data, isLoading } = useDashboardOverviewQuery();

  return (
    <section>
      <h2 className="text-2xl font-medium mb-3">Events Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard
          title="Total Organizations"
          value={data?.totalOrganizations ?? 0}
          isLoading={isLoading}
        />

        <StatCard
          title="Upcoming Events"
          value={data?.upcomingEvents ?? 0}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
