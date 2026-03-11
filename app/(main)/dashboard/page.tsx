"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { UserType } from "@/lib/types/user-type";
import { AdminDashboard } from "@/components/features/dashboard/admin-dashboard";
import { SuperadminDashboard } from "@/components/features/dashboard/superadmin-dashboard";

const DashboardPage = () => {
  const { user, isLoading } = useAuthStore();

  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-6">
        <div className="space-y-8">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-24 w-full bg-gray-200 rounded-xl animate-pulse" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </div>
          <div className="h-[500px] bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 mb-10">
      {user.role === UserType.ADMIN ? (
        <SuperadminDashboard />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
};

export default DashboardPage;
