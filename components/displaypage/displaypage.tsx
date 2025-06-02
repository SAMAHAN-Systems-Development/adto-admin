"use client";
import { Button } from "../ui/button";
import {
  HiOutlinePlusCircle,
  HiOutlineChartSquareBar,
  HiOutlineExternalLink,
} from "react-icons/hi";
import { FaRegFileAlt } from "react-icons/fa";
import { MoreHorizontal } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../ui/table";
import { Card, CardHeader, CardContent } from "../ui/card";

const data = [
  {
    orgName: "SAMAHAN Systems and Development",
    eventName: "SAMAHAN SYSDEV General Assembly",
    date: "Jan 16, 2025",
    status: "Approved",
    color: "bg-blue-600",
  },
  {
    orgName: "Samahang Mag-Aaral ng Sikolohiyang Filipino",
    eventName: "SAMAHAN SYSDEV General Assembly",
    date: "Jan 16, 2025",
    status: "Rejected",
    color: "bg-red-700",
  },
  {
    orgName: "Computer Studies Student Executive Council",
    eventName: "SAMAHAN SYSDEV General Assembly",
    date: "Jan 16, 2025",
    status: "Approved",
    color: "bg-fuchsia-500",
  },
  {
    orgName: "Junior Philippine Institute of Accountants – AdDU Chapter",
    eventName: "SAMAHAN SYSDEV General Assembly",
    date: "Jan 16, 2025",
    status: "Pending",
    color: "bg-yellow-400",
  },
  {
    orgName: "CATeneo",
    eventName: "SAMAHAN SYSDEV General Assembly",
    date: "Jan 16, 2025",
    status: "Approved",
    color: "bg-blue-600",
  },
];

export default function DisplayPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 md:px-8">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg w-full max-w-7xl">
        <h1 className="font-Figtree font-bold text-3xl sm:text-4xl md:text-5xl pb-4 sm:pb-6">
          Hello, Superadmin
        </h1>
        <p className="font-figtree font-medium text-xl sm:text-2xl pb-4">
          Quick Actions
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-8">
          <Button className="bg-[#2563EB] w-full sm:w-[195px] h-[50px] text-base">
            <HiOutlinePlusCircle className="text-xl mr-2" />
            Add organization
          </Button>
          <Button className="bg-[#2563EB] w-full sm:w-[160px] h-[50px] text-base">
            <FaRegFileAlt className=" mr-1 " />
            View Logs
          </Button>
        </div>

        <p className="font-figtree font-medium text-xl sm:text-2xl pb-4">
          Events Overview
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pb-8">
          {[
            { label: "Total Organizations", count: 48 },
            { label: "Active Organizations", count: 40 },
            { label: "Inactive Organizations", count: 8 },
          ].map((item, i) => (
            <Card
              key={i}
              className="h-[140px] w-full border-blue-700 border-2 rounded-2xl bg-slate-200"
            >
              <CardHeader className="flex flex-row items-center text-blue-700 text-lg font-medium justify-between">
                {item.label}
               <a href="">
                  <HiOutlineExternalLink />
                </a>
              </CardHeader>
              <CardContent className="text-blue-700 text-4xl font-medium mt-[-10px]">
                {item.count}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4">
          <p className="font-figtree font-medium text-xl sm:text-2xl">
            Recently Created Events
          </p>
          <a
            href="#"
            className="text-blue-700 font-figtree font-medium text-base mt-2 sm:mt-0"
          >
            View All Events
          </a>
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-300 shadow-sm">
          <Table className="min-w-full table-auto text-xs sm:text-sm md:text-base">
            <TableHeader className="bg-blue-100 text-blue-900">
              <TableRow>
                <TableHead className="px-4 py-3">Organization Name</TableHead>
                <TableHead className="pl-20 py-3">Event Name</TableHead>
                <TableHead className="py-3">Date Created</TableHead>
                <TableHead className="py-3">Event Status</TableHead>
                <TableHead className="text-right px-4 py-3" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, i) => (
                <TableRow key={i} className="text-sm">
                  <TableCell className="flex items-center gap-2 font-medium px-4 py-5 whitespace-nowrap">
                    <span className={`w-3 h-3 rounded-full ${row.color}`} />
                    {row.orgName}
                  </TableCell>
                  <TableCell className="px-4 py-5 whitespace-nowrap">
                    {row.eventName}
                  </TableCell>
                  <TableCell className="px-4 py-5 whitespace-nowrap">
                    {row.date}
                  </TableCell>
                  <TableCell className="px-4 py-5 whitespace-nowrap">
                    <span
                      className={`${
                        row.status === "Approved"
                          ? "text-blue-700"
                          : row.status === "Rejected"
                          ? "text-red-600"
                          : "text-slate-600"
                      } font-medium`}
                    >
                      {row.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right px-4 py-5 whitespace-nowrap">
                    <a href="">
                      <MoreHorizontal className="text-gray-500 w-6 h-6" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
