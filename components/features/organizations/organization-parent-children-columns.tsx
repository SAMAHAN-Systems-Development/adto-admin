"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { OrganizationChild } from "@/lib/types/entities";

export const organizationParentChildrenColumns: ColumnDef<OrganizationChild>[] = [
  {
    accessorKey: "name",
    header: () => <span className="text-secondary-100">Name</span>,
    enableHiding: false,
    cell: ({ row }) => {
      const org = row.original;
      return (
        <div className="flex items-center space-x-3 max-w-[240px]">
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
          {org.acronym || <span className="text-muted-foreground">-</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: () => <span className="text-secondary-100">Description</span>,
    cell: ({ row }) => {
      const org = row.original;
      return <div className="text-sm line-clamp-2">{org.description || "No description"}</div>;
    },
  },
  {
    id: "eventsCount",
    header: () => <span className="text-secondary-100">Events</span>,
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
];
