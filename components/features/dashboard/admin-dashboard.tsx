"use client";

import { OverviewSection } from "./overview-section";
import { EventCalendar } from "./event-calendar";
import { QuickActions } from "./quick-actions";
import { UserType } from "@/lib/types/user-type";

export function AdminDashboard() {
  return (
    <div className="space-y-10">
      <OverviewSection role={UserType.ORGANIZATION} />
      <EventCalendar role={UserType.ORGANIZATION} />
      <QuickActions />
    </div>
  );
}
