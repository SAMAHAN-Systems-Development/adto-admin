"use client";
import * as React from "react";
import {
	ColumnDef,
	RowSelectionState,
	SortingState,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {} from "@/components/ui/checkbox";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function OrganizatonTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onRowSelectionChange: setRowSelection,
		enableRowSelection: true,

		state: {
			sorting,
			rowSelection,
		},
	});
	return (
		<div className="rounded-2xl border border-secondary w-full overflow-hidden">
			<Table>
				<TableHeader>
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow
							key={headerGroup.id}
							className="bg-slate-200  border-secondary"
						>
							{headerGroup.headers.map((header) => {
								const isCheckboxColumn = header.id === "select";
								return (
									<TableHead
										key={header.id}
										className={`text-secondary border-secondary font-normal ${
											isCheckboxColumn ? "w-12" : ""
										}`}
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
								className={`border-secondary text-center ${
									row.getIsSelected() ? "bg-gray-100" : ""
								}`}
								key={row.id}
								data-state={row.getIsSelected() && "selected"}
							>
								{row.getVisibleCells().map((cell) => {
									const isCheckboxColumn = cell.column.id === "select";
									return (
										<TableCell
											key={cell.id}
											className={isCheckboxColumn ? "w-12" : ""}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									);
								})}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={columns.length}
								className="h-24 text-center"
							>
								Try Again
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
