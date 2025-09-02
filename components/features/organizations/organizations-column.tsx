"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, ArrowUpDown, Circle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export type Organizations = {
  name: string;
  acronym: string;
  email: string;
  orgEvents: number;
  /**
   * TODO: REPLACE COLOR WITH ACTUAL ORG PICTURES
   * !PLACEHOLDER FOR NOW
   * **/
  icon?: string;
};
export const columns: ColumnDef<Organizations>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const isAllSelected = table.getIsAllPageRowsSelected();
      const isSomeSelected = table.getIsSomePageRowsSelected();

      return (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={isAllSelected || (isSomeSelected && !isAllSelected)}
            onCheckedChange={() =>
              table.toggleAllPageRowsSelected(!isAllSelected)
            }
            aria-label="Select all"
            className="border-secondary"
          />
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center justify-center ">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={() => row.toggleSelected(!row.getIsSelected())}
          aria-label="Select row"
          className="border-secondary text-secondary"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant={"ghost"}
          className="p-0 ml-4 hover:bg-transparent"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Organization Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const org = row.original;
      return (
        <div className="flex items-center space-x-2 ml-2">
          <Circle className="h-6 w-6" fill={org.icon} />
          <span>{org.name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "acronym",
    header: ({}) => <div className="text-center">Acronym</div>,
  },
  {
    accessorKey: "email",
    header: ({}) => <div className="text-center">Email Address</div>,
  },
  {
    accessorKey: "orgEvents",
    header: ({}) => <div className="text-center">No. of Events</div>,
  },

  {
    id: "actions",
    cell({}) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 ">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-secondary text-secondary"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
