"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EventRequestItem } from "@/lib/types/requests/EventRequestRequests";
import { format } from "date-fns";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export const createEventRequestColumns = (): ColumnDef<EventRequestItem>[] => [
  {
    accessorKey: "event.name",
    header: () => <span className="text-secondary-100">Event</span>,
    cell: ({ row }) => {
      const request = row.original;
      return (
        <div className="font-medium text-sm">
          {request.event.name}
        </div>
      );
    },
  },
  {
    accessorKey: "org.name",
    header: () => <span className="text-secondary-100">Organization</span>,
    cell: ({ row }) => {
      const request = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium">{request.org.name}</div>
          {request.org.acronym && (
            <div className="text-xs text-muted-foreground">
              {request.org.acronym}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <span className="text-secondary-100">Request Date</span>,
    cell: ({ row }) => {
      const request = row.original;
      return (
        <div className="space-y-1">
          <div className="text-sm">
            {format(new Date(request.createdAt), "MMM dd, yyyy")}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(request.createdAt), "h:mm a")}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <span className="text-secondary-100">Status</span>,
    cell: ({ row }) => {
      const request = row.original;

      if (request.status === "PENDING") {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      }
      if (request.status === "APPROVED") {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <CheckCircle2 className="w-3 h-3" /> Approved
          </span>
        );
      }
      if (request.status === "DENIED") {
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <XCircle className="w-3 h-3" /> Denied
          </span>
        );
      }

      return <span className="text-sm text-muted-foreground">Unknown</span>;
    },
  },
];
