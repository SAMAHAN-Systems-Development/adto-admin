"use client";

import {ColumnDef} from "@tanstack/react-table";
import {Ellipsis, ArrowUpDown} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";

export type Organizations = {
	name: string;
	acronym: string;
	email: string;
	orgEvents: number;
	status: "Enabled" | "Disabled";
};
export const columns: ColumnDef<Organizations>[] = [
	{
		accessorKey: "name",
		header: ({column}) => {
			return (
				<Button
					variant={"ghost"}
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					<ArrowUpDown className="ml-2 h-4 w-4" />
					Name
				</Button>
			);
		},
	},
	{
		accessorKey: "acronym",
		header: "Acronym",
	},
	{
		accessorKey: "email",
		header: "Email Address",
	},
	{
		accessorKey: "orgEvents",
		header: "No. of events",
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		id: "actions",
		cell({}) {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0 ml-10"
						>
							<Ellipsis className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel className="">Actions</DropdownMenuLabel>
						<DropdownMenuItem>View Details</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Edit</DropdownMenuItem>
						<DropdownMenuItem>VArchive</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
