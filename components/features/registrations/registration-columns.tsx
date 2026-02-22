"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Registration } from "@/lib/types/entities";
import { Switch } from "@/components/ui/switch";

interface RegistrationsColumnsProps {
  onIsAttendedChange?: (registrationId: string, isAttended: boolean) => void;
}

export const createRegistrationsColumns = ({
  onIsAttendedChange,
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
    enableHiding: false,
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
          />
        </div>
      );
    },
  },
];

// For backward compatibility
export const registrationsColumns = createRegistrationsColumns({
  onIsAttendedChange: () => {},
});
