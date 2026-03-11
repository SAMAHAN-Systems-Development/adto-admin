"use client";

import {
  useAdminOverviewQuery,
  useSuperadminOverviewQuery,
} from "@/lib/api/queries/dashboardQueries";
import { StatCard } from "./stat-card";
import { UserType } from "@/lib/types/user-type";

interface OverviewSectionProps {
  role: UserType;
}

export function OverviewSection({ role }: OverviewSectionProps) {
  const isAdmin = role === UserType.ADMIN;

  const adminQuery = useAdminOverviewQuery();
  const superadminQuery = useSuperadminOverviewQuery();

  const { data, isLoading } = isAdmin ? superadminQuery : adminQuery;

  if (isAdmin) {
    const superadminData = data as {
      totalOrganizations: number;
      totalEvents: number;
      upcomingEvents: number;
      ongoingEvents: number;
      draftEvents: number;
    } | undefined;

    return (
      <section>
        <h2 className="text-2xl font-semibold mb-4">Platform Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          <StatCard
            title="Total Organizations"
            value={superadminData?.totalOrganizations ?? 0}
            isLoading={isLoading}
          />
          <StatCard
            title="Total Events"
            value={superadminData?.totalEvents ?? 0}
            isLoading={isLoading}
          />
          <StatCard
            title="Upcoming Events"
            value={superadminData?.upcomingEvents ?? 0}
            isLoading={isLoading}
          />
          <StatCard
            title="Ongoing Events"
            value={superadminData?.ongoingEvents ?? 0}
            isLoading={isLoading}
          />
          <StatCard
            title="Draft Events"
            value={superadminData?.draftEvents ?? 0}
            isLoading={isLoading}
          />
        </div>
      </section>
    );
  }

  const adminData = data as {
    totalEvents: number;
    upcomingEvents: number;
    ongoingEvents: number;
    draftEvents: number;
  } | undefined;

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Events Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Events"
          value={adminData?.totalEvents ?? 0}
          isLoading={isLoading}
        />
        <StatCard
          title="Upcoming Events"
          value={adminData?.upcomingEvents ?? 0}
          isLoading={isLoading}
        />
        <StatCard
          title="Ongoing Events"
          value={adminData?.ongoingEvents ?? 0}
          isLoading={isLoading}
        />
        <StatCard
          title="Draft Events"
          value={adminData?.draftEvents ?? 0}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}
