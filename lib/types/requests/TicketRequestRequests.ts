export type TicketRequestStatus = 'PENDING' | 'APPROVED' | 'DECLINED';

export interface TicketLatestRequest {
  id: string;
  status: TicketRequestStatus;
  ticketLink?: string;
  declineReason?: string;
  createdAt: string;
}

export interface TicketRequestItem {
  id: string;
  ticketId: string;
  orgId: string;
  status: TicketRequestStatus;
  ticketLink?: string;
  declineReason?: string;
  createdAt: string;
  updatedAt: string;
  ticket: {
    id: string;
    name: string;
    description: string;
    thumbnail?: string;
    price: number;
    capacity: number;
    registrationDeadline: string;
    event: {
      id: string;
      name: string;
    };
  };
  org: {
    id: string;
    name: string;
    acronym?: string;
    icon?: string;
  };
}

export interface TicketRequestsResponse {
  data: TicketRequestItem[];
  meta: {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface TicketRequestQueryParams {
  page?: number;
  limit?: number;
  status?: TicketRequestStatus;
  searchFilter?: string;
  organizationId?: string;
  orderBy?: 'asc' | 'desc';
}
