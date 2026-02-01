import { OverviewSection } from "@/components/features/dashboard/overview-section";
import React from "react";

const DashboardPage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-5xl font-bold my-10">Hello, SAMAHAN SYSDEV</h1>
      <OverviewSection />
    </div>
  );
};

export default DashboardPage;
