"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Edit, Archive, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Event } from "@/lib/types/entities";
import { format } from "date-fns";
import Link from "next/link";

interface EventsColumnsProps {
  onArchiveEvent?: (eventId: string) => void;
  onViewEvent?: (event: Event) => void;
}

export const createEventsColumns = ({
  onArchiveEvent,
  onViewEvent,
}: EventsColumnsProps = {}): ColumnDef<Event>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: () => <span className="text-secondary-100">Event Name</span>,
    cell: ({ row }) => {
      const event = row.original;
      return (
        <div className="space-y-1">
          <div className="font-medium">{event.name}</div>
          <div className="text-sm text-muted-foreground line-clamp-2">
            {event.description}
          </div>
        </div>
      );
    },
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
            <span className="text-sm text-muted-foreground">Closed</span>
          )}
        </div>
      );
    },
  },
  {
    id: "status",
    header: () => <span className="text-secondary-100">Published</span>,
    cell: ({ row }) => {
      const event = row.original;

      if (event.isPublished === true) {
        return <span className="text-secondary-400">Approved</span>;
      } else if (event.isPublished === false) {
        return <span className="text-foreground">Pending</span>;
      }

      return <span className="text-foreground">Pending</span>;
    },
  },
  {
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
  },
];

// For backward compatibility
export const eventsColumns = createEventsColumns();
