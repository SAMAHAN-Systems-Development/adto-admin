"use client";

import { useAuthStore } from "@/lib/store/authStore";
import { UserType } from "@/lib/types/user-type";
import HelpPageContent from "@/components/features/help/help-page-content";

export default function HelpPage() {
  const { user, isLoading } = useAuthStore();

  if (isLoading || !user) {
    return (
      <div className="container mx-auto py-6">
        <div className="space-y-4">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-40 w-full bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-60 w-full bg-gray-200 rounded-xl animate-pulse" />
          <div className="h-52 w-full bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const role =
    user.role === UserType.ADMIN ? UserType.ADMIN : UserType.ORGANIZATION;

  return <HelpPageContent role={role} />;
}
