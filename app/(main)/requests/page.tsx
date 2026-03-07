"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/shared/data-table";
import { createTicketRequestColumns } from "@/components/features/ticket-requests/ticket-request-columns";
import { TicketRequestDetailModal } from "@/components/features/ticket-requests/ticket-request-detail-modal";
import { useTicketRequestsQuery } from "@/lib/api/queries/ticketRequestQueries";
import {
  TicketRequestItem,
  TicketRequestStatus,
} from "@/lib/types/requests/TicketRequestRequests";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { Toaster } from "react-hot-toast";

export default function RequestsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<TicketRequestStatus>("PENDING");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<TicketRequestItem | null>(null);

  const debouncedSearch = useDebounce(searchFilter, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const { data, isLoading } = useTicketRequestsQuery({
    page,
    limit,
    status: statusFilter,
    searchFilter: debouncedSearch || undefined,
    orderBy: "desc",
  });

  const columns = createTicketRequestColumns();

  const handleRowClick = (row: TicketRequestItem) => {
    setSelectedRequest(row);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto py-10 px-6">
        <Toaster position="bottom-right" />

        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Ticket Requests
        </h1>
        <p className="text-gray-600 mb-8">
          Review and manage ticket link requests from organizations.
        </p>

        {/* Status Filter Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex gap-6">
            {(["PENDING", "APPROVED", "DECLINED"] as TicketRequestStatus[]).map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`pb-3 px-1 text-sm font-medium transition-colors capitalize ${
                    statusFilter === status
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </button>
              )
            )}
          </nav>
        </div>

        <DataTable
          title="Requests"
          columns={columns}
          data={data?.data || []}
          searchColumn="ticket.name"
          searchPlaceholder="Search by ticket or organization name..."
          entityName="requests"
          isTableLoading={isLoading}
          onRowClick={handleRowClick}
          pagination={{
            page,
            limit,
            totalCount: data?.meta?.totalCount || 0,
            totalPages: data?.meta?.totalPages || 0,
            onPageChange: setPage,
            onLimitChange: setLimit,
          }}
          search={{
            value: searchFilter,
            onSearchChange: setSearchFilter,
          }}
        />

        {/* Detail Modal */}
        {selectedRequest && (
          <TicketRequestDetailModal
            request={selectedRequest}
            isOpen={!!selectedRequest}
            onClose={() => setSelectedRequest(null)}
          />
        )}
      </div>
    </div>
  );
}
