"use client";

import Link from "next/link";
import { Plus, CalendarDays } from "lucide-react";

export function QuickActions() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/events?create=true" className="group">
          <div
            className="rounded-[20px] border border-transparent p-5 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              background:
                "linear-gradient(#E2E8F0, #E2E8F0) padding-box, linear-gradient(to bottom, #1e40af, #3b82f6) border-box",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-blue-900 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Plus className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent">
                  Create New Event
                </p>
                <p className="text-sm text-gray-500">
                  Set up a new event for your organization
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link href="/events" className="group">
          <div
            className="rounded-[20px] border border-transparent p-5 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              background:
                "linear-gradient(#E2E8F0, #E2E8F0) padding-box, linear-gradient(to bottom, #1e40af, #3b82f6) border-box",
            }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-blue-900 to-blue-600 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-semibold bg-gradient-to-b from-blue-900 to-blue-600 bg-clip-text text-transparent">
                  View Events
                </p>
                <p className="text-sm text-gray-500">
                  Browse and manage your events
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
