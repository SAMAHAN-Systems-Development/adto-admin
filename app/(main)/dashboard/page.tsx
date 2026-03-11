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
        <div className="space-y-6">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-200 rounded-[20px] animate-pulse"
              />
            ))}
          </div>
          <div className="h-[500px] bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const greeting =
    user.role === UserType.ADMIN
      ? "Welcome, Superadmin"
      : "Welcome back";

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
        {greeting}
      </h1>

      {user.role === UserType.ADMIN ? (
        <SuperadminDashboard />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
};

export default DashboardPage;
