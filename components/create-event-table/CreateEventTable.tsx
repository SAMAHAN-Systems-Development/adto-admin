"use client";

import * as React from "react";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	ArrowUpDown,
	ChevronDown,
	MoreHorizontal,
	CircleCheck,
	CircleX,
	Circle,
	CirclePlus,
	ChevronsLeftRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { AteneoEvent, data } from "../columns/events-sample";

// const data: AteneoEvent[] = [
// 	{
// 		id: "m5gr84i9",
// 		amount: 316,
// 		status: "success",
// 		email: "ken99@example.com",
// 	},
// 	{
// 		id: "3u1reuv4",
// 		amount: 242,
// 		status: "success",
// 		email: "Abe45@example.com",
// 	},
// 	{
// 		id: "derv1ws0",
// 		amount: 837,
// 		status: "processing",
// 		email: "Monserrat44@example.com",
// 	},
// 	{
// 		id: "5kma53ae",
// 		amount: 874,
// 		status: "success",
// 		email: "Silas22@example.com",
// 	},
// 	{
// 		id: "bhqecj4p",
// 		amount: 721,
// 		status: "failed",
// 		email: "carmella@example.com",
// 	},
// ];

export const columns: ColumnDef<AteneoEvent>[] = [
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
			console.log(row.original);
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
			const payment = row.original;

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

export function CreateEventTable() {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	return (
		<div className="w-full">
			<div className="flex items-center py-4 justify-between">
				<h1 className="text-3xl text-secondary-200 font-semibold">My Events</h1>
				<Button className="bg-secondary-300 hover:bg-secondary-300 text-white font-medium rounded-md flex items-center gap-2">
					<CirclePlus fill="white" stroke="var(--secondary-300)" />
					Add Event
				</Button>
			</div>
			<div className="rounded-xl border border-secondary-200 overflow-hidden">
				<Table>
					<TableHeader className="bg-muted text-secondary-200 ">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="text-secondary-200 border-b border-secondary-200"
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="border-b border-secondary-200"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
