"use client";

import { StatCard } from "./stat-card";
import { UserType } from "@/lib/types/user-type";
import type { AdminOverviewResponse, SuperadminOverviewResponse } from "@/lib/api/services/dashboardServices";

interface OverviewSectionProps {
  role: UserType;
  data?: AdminOverviewResponse | SuperadminOverviewResponse | null;
  isLoading: boolean;
}

export function OverviewSection({ role, data, isLoading }: OverviewSectionProps) {
  const isAdmin = role === UserType.ADMIN;

  if (isAdmin) {
    const superadminData = data as SuperadminOverviewResponse | undefined;

    return (
      <section>
        <h2 className="text-xl font-semibold mb-3">Platform Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-5">
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

  const adminData = data as AdminOverviewResponse | undefined;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Events Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
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
