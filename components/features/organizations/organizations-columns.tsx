"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Edit, Archive } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { OrganizationChild } from "@/lib/types/entities";

interface OrganizationColumnsProps {
  onArchiveOrganization: (id: string) => void;
  onViewOrganization?: (organization: OrganizationChild) => void;
}

export const createOrganizationsColumns = ({
  onArchiveOrganization,
  onViewOrganization,
}: OrganizationColumnsProps): ColumnDef<OrganizationChild>[] => [
  {
    accessorKey: "name",
    header: () => <span className="text-secondary-100">Name</span>,
    cell: ({ row }) => {
      const org = row.original;
      return (
        <div className="flex items-center space-x-3 max-w-[200px]">
          {org.icon ? (
            <Image
              src={org.icon}
              alt={org.name}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-medium text-gray-600">
                {org.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="font-medium truncate">{org.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "acronym",
    header: () => <span className="text-secondary-100">Acronym</span>,
    cell: ({ row }) => {
      const org = row.original;
      return (
        <div className="font-medium">
          {org.acronym || <span className="text-muted-foreground">—</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <span className="text-secondary-100">Description</span>,
    cell: ({ row }) => {
      const org = row.original;
      return (
        <div className="space-y-1">
          <div className="text-sm line-clamp-2">
            {org.description || "No description"}
          </div>
        </div>
      );
    },
  },
  {
    id: "eventsCount",
    header: () => (
      <div className="flex items-center text-secondary-100">Events</div>
    ),
    cell: ({ row }) => {
      const org = row.original;
      return (
        <div className="text-center">
          <div className="font-medium">{org.events?.length || 0}</div>
          <div className="text-xs text-muted-foreground">events</div>
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const organization = row.original;

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(organization.id)}>
              Copy organization ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {onViewOrganization && (
              <DropdownMenuItem
                onClick={() => onViewOrganization(organization)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => {
                window.location.href = `/organizations/${organization.id}`;
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onArchiveOrganization(organization.id)}
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
