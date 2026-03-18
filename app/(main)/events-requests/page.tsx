"use client";

import { useState } from "react";
import { DataTable } from "@/components/shared/data-table";
import { useEventRequestsQuery } from "@/lib/api/queries/eventRequestQueries";
import { createEventRequestColumns } from "@/components/features/events-requests/event-request-columns";
import { EventRequestDetailModal } from "@/components/features/events-requests/event-request-detail-modal";
import { EventRequestItem } from "@/lib/types/requests/EventRequestRequests";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserType } from "@/lib/types/user-type";

export default function EventsRequestsPage() {
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "APPROVED" | "DENIED">("PENDING");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<EventRequestItem | null>(null);

  const { data: requestsData, isLoading } = useEventRequestsQuery({
    page,
    limit,
    status: activeTab === "ALL" ? "" : activeTab,
    searchFilter,
  });

  const columns = createEventRequestColumns();

  const handleRowClick = (row: EventRequestItem) => {
    setSelectedRequest(row);
  };

  const closeModal = () => {
    setSelectedRequest(null);
  };

  return (
    <ProtectedRoute requiredRole={UserType.ADMIN}>
    <div className="min-h-screen">
      <div className="container mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Requests</h1>
        <p className="text-gray-600 mb-8">Review and manage concept papers submitted for approval.</p>

        {/* Status Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {["PENDING", "APPROVED", "DENIED", "ALL"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as "ALL" | "PENDING" | "APPROVED" | "DENIED");
                  setPage(1);
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab === "ALL" ? "All Requests" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </nav>
        </div>

        {/* Data Table */}
        <DataTable
          title="Event Requests"
          columns={columns as unknown as import("@tanstack/react-table").ColumnDef<unknown>[]}
          data={requestsData?.data as unknown[] || []}
          searchColumn="event.name"
          searchPlaceholder="Search event names or organizations..."
          entityName="event requests"
          pagination={{
            page,
            limit,
            totalCount: requestsData?.meta?.totalCount || 0,
            totalPages: requestsData?.meta?.totalPages || 0,
            onPageChange: setPage,
            onLimitChange: setLimit,
          }}
          search={{
            value: searchFilter,
            onSearchChange: setSearchFilter,
          }}
          isTableLoading={isLoading}
          onRowClick={handleRowClick as unknown as (row: unknown) => void}
        />

        {/* Detail Modal */}
        {selectedRequest && (
          <EventRequestDetailModal
            request={selectedRequest}
            isOpen={!!selectedRequest}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}
