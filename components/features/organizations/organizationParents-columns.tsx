"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Edit, Archive } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { OrganizationParent } from "@/lib/types/entities";

interface OrganizationParentColumnsProps {
  onArchiveOrganizationParent: (id: string) => void;
  onViewOrganizationParent?: (organizationParent: OrganizationParent) => void;
}

export const createOrganizationParentsColumns = ({
  onArchiveOrganizationParent,
  onViewOrganizationParent,
}: OrganizationParentColumnsProps): ColumnDef<OrganizationParent>[] => [
  {
    accessorKey: "name",
    header: () => <span className="text-secondary-100">Name</span>,
    cell: ({ row }) => {
      const orgParent = row.original;
      return (
        <div className="flex items-center space-x-3 max-w-[200px]">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-gray-600">
              {orgParent.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="font-medium truncate">{orgParent.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <span className="text-secondary-100">Description</span>,
    cell: ({ row }) => {
      const orgParent = row.original;
      return (
        <div className="space-y-1">
          <div className="text-sm line-clamp-2">
            {orgParent.description || "No description"}
          </div>
        </div>
      );
    },
  },
  {
    id: "orgCount",
    header: () => (
      <div className="flex items-center text-secondary-100">
        No. of Organizations
      </div>
    ),
    cell: ({ row }) => {
      const orgParent = row.original;
      return (
        <div className="text-center">
          <div className="font-medium">
            {orgParent.orgCount}
          </div>
          <div className="text-xs text-muted-foreground">organizations</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const organizationParent = row.original;

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
              onClick={() =>
                navigator.clipboard.writeText(organizationParent.id)
              }
            >
              Copy organization parent ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onViewOrganizationParent && (
              <DropdownMenuItem
                onClick={() => onViewOrganizationParent(organizationParent)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `/organizations/parents/${organizationParent.id}`;
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onArchiveOrganizationParent(organizationParent.id)}
              className="text-destructive focus:text-destructive"
            >
              <Archive className="mr-2 h-4 w-4" />
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
