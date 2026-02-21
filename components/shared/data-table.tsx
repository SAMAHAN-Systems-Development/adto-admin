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
import { ChevronDown, Plus, Search, Settings2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FilterConfig {
  field: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
}

interface DataTableProps<TData> {
  title: string;
  columns: ColumnDef<TData>[];
  data: TData[];
  searchColumn?: string;
  searchPlaceholder?: string;
  addButtonLabel?: string;
  onCreateItem?: () => void;
  entityName?: string;
  pagination?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  };
  search?: {
    value: string;
    onSearchChange: (value: string) => void;
  };
  sorting?: {
    field: string;
    order: "asc" | "desc";
    onSortChange: (field: string, order: "asc" | "desc") => void;
  };
  onRowClick?: (row: TData) => void;
  filters?: FilterConfig[];
  isTableLoading?: boolean;
}

export function DataTable<TData>({
  title,
  columns,
  data,
  searchColumn = "name",
  searchPlaceholder = "Search...",
  addButtonLabel = "Add Item",
  onCreateItem,
  entityName = "items",
  pagination,
  search,
  sorting,
  onRowClick,
  filters,
  isTableLoading = false,
}: DataTableProps<TData>) {
  const [localSorting, setLocalSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const shouldIgnoreRowClick = React.useCallback(
    (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) {
        return false;
      }

      return Boolean(
        target.closest(
          "button, a, input, select, textarea, [role='button'], [role='menuitem'], [role='checkbox'], [role='radio']"
        )
      );
    },
    []
  );

  const isBackendSearch = !!search;
  const isBackendSort = !!sorting;

  const getUniqueFilterOptions = React.useCallback(
    (field: string) => {
      const uniqueValues = new Set<string>();

      data.forEach((item) => {
        const fieldParts = field.split(".");
        let value: unknown = item;

        for (const part of fieldParts) {
          value = (value as Record<string, unknown>)?.[part];
        }

        if (value !== null && value !== undefined && value !== "") {
          uniqueValues.add(String(value));
        }
      });

      return Array.from(uniqueValues)
        .sort()
        .map((value) => ({
          label: value,
          value: value.toLowerCase().replace(/\s+/g, "-"),
        }));
    },
    [data]
  );

  const filteredData = React.useMemo(() => {
    if (!filters || filters.length === 0) return data;

    return data.filter((item) => {
      return filters.every((filter) => {
        if (filter.value === "all") return true;

        const fieldParts = filter.field.split(".");
        let value: unknown = item;

        for (const part of fieldParts) {
          value = (value as Record<string, unknown>)?.[part];
        }

        const normalizedValue = String(value || "")
          .toLowerCase()
          .replace(/\s+/g, "-");
        return normalizedValue === filter.value;
      });
    });
  }, [data, filters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setLocalSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: isBackendSort ? undefined : getSortedRowModel(),
    getFilteredRowModel: isBackendSearch ? undefined : getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: !!pagination,
    manualSorting: isBackendSort,
    manualFiltering: isBackendSearch,
    pageCount: pagination?.totalPages,
    state: {
      sorting: localSorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: pagination
        ? {
            pageIndex: pagination.page - 1,
            pageSize: pagination.limit,
          }
        : undefined,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {onCreateItem && (
          <Button
            onClick={onCreateItem}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            {addButtonLabel}
          </Button>
        )}
      </div>

      {/* Filters on left, Search and Column Visibility on right */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-4">
        {/* Left Side: Filter Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Filter Dropdowns */}
          {filters && filters.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap">
              {filters.map((filter) => {
                const options = getUniqueFilterOptions(filter.field);
                const placeholder = filter.placeholder || `${filter.field}`;

                return (
                  <Select
                    key={filter.field}
                    value={filter.value}
                    onValueChange={filter.onChange}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{placeholder}</SelectItem>
                      {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Search Input and Column Visibility */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={
                isBackendSearch
                  ? search.value
                  : ((table
                      .getColumn(searchColumn)
                      ?.getFilterValue() as string) ?? "")
              }
              onChange={(event) => {
                if (isBackendSearch) {
                  search.onSearchChange(event.target.value);
                } else {
                  table
                    .getColumn(searchColumn)
                    ?.setFilterValue(event.target.value);
                }
              }}
              className="pl-10"
            />
            {isTableLoading && (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 animate-spin" />
            )}
          </div>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 whitespace-nowrap">
                <Settings2 className="h-4 w-4" />
                Customize Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
          <TableBody className="relative">
            {/* Loading overlay for table rows only */}
            {isTableLoading && (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="!p-0 !m-0 absolute inset-0 pointer-events-none"
                >
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-50 flex items-center justify-center pointer-events-auto">
                    <div className="flex flex-col items-center gap-2 bg-white/90 px-6 py-4 rounded-lg shadow-sm">
                      <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                      <p className="text-sm text-gray-600">Loading...</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow 
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={(event) => {
                    if (shouldIgnoreRowClick(event.target)) {
                      return;
                    }

                    onRowClick?.(row.original);
                  }}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
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

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-gray-600">
          {pagination ? (
            <>
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(
                pagination.page * pagination.limit,
                pagination.totalCount
              )}{" "}
              of {pagination.totalCount} {entityName}
            </>
          ) : (
            <>
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {pagination && (
            <>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    {pagination.limit} per page
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup
                    value={pagination.limit.toString()}
                    onValueChange={(value) =>
                      pagination.onLimitChange(Number(value))
                    }
                  >
                    <DropdownMenuRadioItem value="10">
                      10 per page
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="20">
                      20 per page
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="50">
                      50 per page
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="100">
                      100 per page
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1 || isTableLoading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => pagination.onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages || isTableLoading}
                >
                  Next
                </Button>
              </div>
            </>
          )}
          {!pagination && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}