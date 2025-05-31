import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  MoreHorizontal,
  CircleCheck,
  CircleX,
  Circle,
  ChevronsLeftRight,
} from "lucide-react";
import { AteneoEvent } from "@/lib/types/AteneoEvent";

export const createAdminTableColumns: ColumnDef<AteneoEvent>[] = [
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
        className="border border-secondary-200"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border border-secondary-200"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Event Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-row gap-2 items-center">
          <Circle fill="var(--secondary-400)" stroke="var(--secondary-400)" />
          <div className="flex flex-col gap-">
            <h3 className="capitalize">{row.getValue("name")}</h3>
            <h4 className="text-xs font-light">{row.original.events} events</h4>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="capitalize">{row.getValue("date")}</div>,
  },
  {
    accessorKey: "registration",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Registration Status
          <ChevronsLeftRight />
        </Button>
      );
    },
    cell: ({ row }) => {
      const registration: string = row.getValue("registration");
      return (
        <div className="flex flex-row gap-1 items-center max-md:justify-center">
          {registration === "Close" ? (
            <CircleX size={24} fill="var(--destructive)" stroke="white" />
          ) : (
            <CircleCheck size={24} fill="var(--secondary-300)" stroke="white" />
          )}
          <div className="capitalize">{registration}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Event Status</div>,
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      const statusColor =
        status === "Approved"
          ? "var(--secondary-200)"
          : status === "Rejected"
          ? "var(--destructive)"
          : "black";
      return (
        <div
          className="text-right font-medium flex justify-center"
          style={{ color: statusColor }}
        >
          {status}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="text-secondary-200 border border-secondary-200"
          >
            <DropdownMenuItem>View Edits</DropdownMenuItem>
            <DropdownMenuItem>Details</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
]; 