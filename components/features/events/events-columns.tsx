"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Edit, Archive, Check, X, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Event } from "@/lib/types/entities";
import { format } from "date-fns";
import Link from "next/link";

export type EventTab = "DRAFT" | "UPCOMING" | "FINISHED" | "ARCHIVED";

interface EventsColumnsProps {
  onArchiveEvent?: (eventId: string) => void;
  onViewEvent?: (event: Event) => void;
  onExportRegistrantsPdf?: (event: Event) => void;
  isExportingRegistrantsPdf?: boolean;
  tab?: EventTab;
}

const DESCRIPTION_PREVIEW_MAX_LENGTH = 100;

const getDescriptionPreview = (description: string) => {
  const normalizedDescription = description?.trim() || "";

  if (normalizedDescription.length <= DESCRIPTION_PREVIEW_MAX_LENGTH) {
    return {
      text: normalizedDescription,
      truncated: false,
    };
  }

  return {
    text: normalizedDescription.slice(0, DESCRIPTION_PREVIEW_MAX_LENGTH),
    truncated: true,
  };
};

// -- Shared columns --

const nameColumn: ColumnDef<Event> = {
  accessorKey: "name",
  header: () => <span className="text-secondary-100">Event Name</span>,
  enableHiding: false,
  cell: ({ row }) => {
    const event = row.original;
    const descriptionPreview = getDescriptionPreview(event.description);

    return (
      <div className="space-y-1">
        <div className="font-medium">{event.name}</div>
        <div className="text-sm text-muted-foreground line-clamp-2 break-words">
          {descriptionPreview.text}
          {descriptionPreview.truncated && (
            <>
              ...{" "}
              <span className="cursor-pointer text-secondary-400">
                See more
              </span>
            </>
          )}
        </div>
      </div>
    );
  },
};

const dateStartColumn: ColumnDef<Event> = {
  accessorKey: "dateStart",
  header: () => <span className="text-secondary-100">Date</span>,
  cell: ({ row }) => {
    const event = row.original;
    return (
      <div className="space-y-1">
        <div className="text-sm">
          {format(new Date(event.dateStart), "MMM dd, yyyy")}
        </div>
        <div className="text-xs text-muted-foreground">
          {format(new Date(event.dateStart), "h:mm a")} -{" "}
          {format(new Date(event.dateEnd), "h:mm a")}
        </div>
      </div>
    );
  },
};

const dateEndedColumn: ColumnDef<Event> = {
  accessorKey: "dateEnd",
  header: () => <span className="text-secondary-100">Date Ended</span>,
  cell: ({ row }) => {
    const event = row.original;
    return (
      <div className="space-y-1">
        <div className="text-sm">
          {format(new Date(event.dateEnd), "MMM dd, yyyy")}
        </div>
        <div className="text-xs text-muted-foreground">
          {format(new Date(event.dateEnd), "h:mm a")}
        </div>
      </div>
    );
  },
};

const orgColumn: ColumnDef<Event> = {
  accessorKey: "org.name",
  header: () => <span className="text-secondary-100">Organization</span>,
  cell: ({ row }) => {
    const event = row.original;
    return (
      <div className="space-y-1">
        <div className="font-medium">{event.org.name}</div>
        <div className="text-xs text-muted-foreground">
          {event.org.acronym}
        </div>
      </div>
    );
  },
};

const registrationsColumn: ColumnDef<Event> = {
  accessorKey: "registrations",
  header: () => (
    <div className="flex items-center text-secondary-100">Registrations</div>
  ),
  cell: ({ row }) => {
    const event = row.original;
    return (
      <div className="text-center">
        <div className="font-medium">{event.totalRegistrants || 0}</div>
        <div className="text-xs text-muted-foreground">participants</div>
      </div>
    );
  },
};

const registrationStatusColumn: ColumnDef<Event> = {
  accessorKey: "isRegistrationOpen",
  header: () => (
    <span className="text-secondary-100">Registration Status</span>
  ),
  cell: ({ row }) => {
    const event = row.original;
    return (
      <div className="flex items-center gap-2">
        {event.isRegistrationOpen ? (
          <>
            <div className="relative flex items-center justify-center w-5 h-5 bg-secondary-200 rounded-full">
              <Check className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm">Open</span>
          </>
        ) : (
          <>
            <div className="relative flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
              <X className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm text-muted-foreground">Closed</span>
          </>
        )}
      </div>
    );
  },
};

const createdAtColumn: ColumnDef<Event> = {
  accessorKey: "createdAt",
  header: () => <span className="text-secondary-100">Created At</span>,
  cell: ({ row }) => {
    const event = row.original;
    if (!event.createdAt) return <span className="text-muted-foreground">—</span>;
    return (
      <div className="space-y-1">
        <div className="text-sm">
          {format(new Date(event.createdAt), "MMM dd, yyyy")}
        </div>
        <div className="text-xs text-muted-foreground">
          {format(new Date(event.createdAt), "h:mm a")}
        </div>
      </div>
    );
  },
};

const createActionsColumn = ({
  onArchiveEvent,
  onViewEvent,
  onExportRegistrantsPdf,
  isExportingRegistrantsPdf,
}: EventsColumnsProps): ColumnDef<Event> => ({
  id: "actions",
  enableHiding: false,
  cell: ({ row }) => {
    const event = row.original;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(event.id)}
          >
            Copy event ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onViewEvent?.(event)}>
            <Eye className="mr-2 h-4 w-4" />
            View details
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isExportingRegistrantsPdf}
            onClick={() => onExportRegistrantsPdf?.(event)}
          >
            <Download className="mr-2 h-4 w-4" />
            {isExportingRegistrantsPdf
              ? "Exporting PDF..."
              : "Export Registrants"}
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/events/${event.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit event
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => onArchiveEvent?.(event.id)}
          >
            <Archive className="mr-2 h-4 w-4" />
            Archive event
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
});

// -- Tab-specific column sets --

export const createEventsColumns = ({
  onArchiveEvent,
  onViewEvent,
  onExportRegistrantsPdf,
  isExportingRegistrantsPdf,
  tab = "UPCOMING",
}: EventsColumnsProps = {}): ColumnDef<Event>[] => {
  const actionsCol = createActionsColumn({
    onArchiveEvent,
    onViewEvent,
    onExportRegistrantsPdf,
    isExportingRegistrantsPdf,
  });

  switch (tab) {
    case "DRAFT":
      return [
        nameColumn,
        dateStartColumn,
        orgColumn,
        createdAtColumn,
        actionsCol,
      ];
    case "UPCOMING":
      return [
        nameColumn,
        dateStartColumn,
        orgColumn,
        registrationsColumn,
        registrationStatusColumn,
        actionsCol,
      ];
    case "FINISHED":
      return [
        nameColumn,
        dateEndedColumn,
        orgColumn,
        registrationsColumn,
        actionsCol,
      ];
    case "ARCHIVED":
      return [
        nameColumn,
        dateEndedColumn,
        orgColumn,
        dateStartColumn,
        actionsCol,
      ];
    default:
      return [
        nameColumn,
        dateStartColumn,
        orgColumn,
        registrationsColumn,
        registrationStatusColumn,
        actionsCol,
      ];
  }
};

// For backward compatibility
export const eventsColumns = createEventsColumns();
