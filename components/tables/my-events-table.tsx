/**
 * @file This file provides temporary placeholder data and column definitions for the Events table component.
 *
 * @remarks
 * While the Events and Organizations tables appear similar, it is recommended to keep them separate.
 * Sharing a generic table may lead to maintenance issues as each evolves independently.
 *
 * @todo
 * Replace the placeholder data with real data and implement the final table design.
 */

import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Ellipsis } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { archiveEventService } from "@/client/services/archiveEventService";

interface Event {
  id: string;
  name: string;
  date: string;
  registrationStatus: string;
  eventStatus: string;
}

const data: Event[] = [
  {
    id: "1",
    name: "SAMAHAN SYSDEV General Assembly",
    date: new Date().toLocaleDateString(),
    registrationStatus: "Open",
    eventStatus: "Approved",
  },
  {
    id: "2",
    name: "SAMAHAN SYSDEV General Assembly",
    date: new Date().toLocaleDateString(),
    registrationStatus: "Open",
    eventStatus: "Approved",
  },
  {
    id: "3",
    name: "SAMAHAN SYSDEV General Assembly",
    date: new Date().toLocaleDateString(),
    registrationStatus: "Open",
    eventStatus: "Approved",
  },
];

const columnHelper = createColumnHelper<Event>();

const columns = [
  columnHelper.accessor("name", {
    header: "Event Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("date", {
    header: "Date",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("registrationStatus", {
    header: "Registration Status",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("eventStatus", {
    header: "Event Status",
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: "dropdown",
    header: () => null,
    cell: ({ row }) => <EventsTablePopover id={row.original.id} />,
  }),
];

function EventsTablePopover({ id }: { id: string }) {
  async function handleArchive() {
    await archiveEventService(id);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Ellipsis />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0">
        <ul className="text-center divide-y [&>li>button]:p-[8px_1rem] [&>li>button]:w-full [&>li>button]:rounded-none">
          <li>
            <Button variant="ghost">View Details</Button>
          </li>
          <li>
            <Button variant="ghost">Details</Button>
          </li>
          <li>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost">Archive</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently archive
                    the selected event and remove it from active views.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleArchive}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function MyEventsTable() {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
