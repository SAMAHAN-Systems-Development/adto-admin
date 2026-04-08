"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Registration } from "@/lib/types/entities";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";

interface RegistrationsColumnsProps {
  onIsAttendedChange?: (registrationId: string, isAttended: boolean) => void;
  onEdit?: (registration: Registration) => void;
  onDelete?: (registration: Registration) => void;
  isRsvpEnabled?: boolean;
}

export const createRegistrationsColumns = ({
  onIsAttendedChange,
  onEdit,
  onDelete,
  isRsvpEnabled,
}: RegistrationsColumnsProps): ColumnDef<Registration>[] => [
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
    accessorKey: "fullName",
    header: () => <span className="text-secondary-100">Full Name</span>,
    enableHiding: false,
    cell: ({ row }) => {
      const registration = row.original;
      return <div className="font-medium">{registration.fullName}</div>;
    },
  },
  {
    accessorKey: "email",
    header: () => <span className="text-secondary-100">Email</span>,
    cell: ({ row }) => {
      const registration = row.original;
      return <div className="font-medium">{registration.email}</div>;
    },
    enableHiding: false,
  },
  {
    id: "organizationGroup",
    accessorKey: "organizationParent.name",
    header: () => <span className="text-secondary-100">Organization Group</span>,
    cell: ({ row }) => {
      const registration = row.original;
      return (
        <div className="font-medium">{registration.organizationParent?.name || "-"}</div>
      );
    },
  },
  {
    id: "organization",
    accessorKey: "organizationChild.name",
    header: () => <span className="text-secondary-100">Organization</span>,
    cell: ({ row }) => {
      const registration = row.original;
      return (
        <div className="font-medium">{registration.organizationChild?.name || "-"}</div>
      );
    },
  },
  {
    accessorKey: "cluster",
    header: () => <span className="text-secondary-100">Cluster</span>,
    cell: ({ row }) => {
      const registration = row.original;
      return <div className="font-medium">{registration.cluster}</div>;
    },
  },
  {
    accessorKey: "yearLevel",
    header: () => <span className="text-secondary-100">Year Level</span>,
    cell: ({ row }) => {
      const registration = row.original;
      return (
        <div className="font-medium">
          {registration.yearLevel}
          {registration.yearLevel === "1"
            ? "st"
            : registration.yearLevel === "2"
              ? "nd"
              : registration.yearLevel === "3"
                ? "rd"
                : "th"}{" "}
          Year
        </div>
      );
    },
  },
  {
    accessorKey: "course",
    header: () => <span className="text-secondary-100">Course</span>,
    cell: ({ row }) => {
      const registration = row.original;
      return <div className="font-medium">{registration.course}</div>;
    },
  },
  {
    id: "ticketCategory",
    header: () => <span className="text-secondary-100">Ticket Category</span>,
    cell: ({ row }) => {
      const registration = row.original;
      return (
        <div className="font-medium">{registration.ticketCategory.name}</div>
      );
    },
  },
  ...(isRsvpEnabled
    ? [
        {
          id: "hasRsvpd",
          header: () => <span className="text-secondary-100">RSVP</span>,
          cell: ({ row }: { row: { original: Registration } }) => {
            const registration = row.original;
            return (
              <div className="font-medium">
                {registration.hasRsvpd ? (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                    Yes
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                    No
                  </span>
                )}
              </div>
            );
          },
        } as ColumnDef<Registration>,
      ]
    : []),
  {
    id: "isAttended",
    header: () => <span className="text-secondary-100">Attended</span>,
    cell: ({ row }) => {
      const registration = row.original;
      return (
        <div className="font-medium">
          <Switch
            checked={registration.isAttended}
            onCheckedChange={(checked) =>
              onIsAttendedChange?.(registration.id, checked)
            }
            className="data-[state=checked]:bg-blue-600"
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const registration = row.original;
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
            <DropdownMenuItem onClick={() => onEdit?.(registration)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(registration)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
  },
];

// For backward compatibility
export const registrationsColumns = createRegistrationsColumns({
  onIsAttendedChange: () => {},
});
