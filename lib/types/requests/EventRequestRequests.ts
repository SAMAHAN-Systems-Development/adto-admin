export interface EventRequestItem {
  id: string;
  eventId: string;
  orgId: string;
  status: "PENDING" | "APPROVED" | "DENIED";
  remark: string | null;
  createdAt: string;
  updatedAt: string;
  event: {
    id: string;
    name: string;
    conceptPaperUrl: string | null;
  };
  org: {
    id: string;
    name: string;
    acronym: string | null;
    icon: string | null;
  };
}

export interface EventRequestQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  searchFilter?: string;
  organizationId?: string;
  eventId?: string;
  orderBy?: "asc" | "desc";
}

export interface EventRequestsResponse {
  data: EventRequestItem[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
