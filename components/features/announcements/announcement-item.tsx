"use client";

import { Archive, SquarePen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AnnouncementResponse } from "@/lib/types/requests/AnnouncementRequests";
import { format } from "date-fns";

interface Props {
  announcement: AnnouncementResponse;
}

export function AnnouncementItem({ announcement }: Props) {
  const formattedDate = format(
    new Date(announcement.updatedAt),
    "'Updated at' MM/dd/yyyy HH:mm"
  );

  const getBadgeClassName = (type: string) => {
    switch (type) {
      case "INFO":
        return "text-blue-700";
      case "WARNING":
        return "text-yellow-700";
      case "CANCELLED":
        return "text-red-700";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="p-4 flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0 min-w-0">
      {/* Left side - Content */}
      <div className="flex-1 max-w-[600px]">
        {/* Title, Badge, and Timestamp */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {announcement.title}
            </h3>
            <Badge
              variant="default"
              className={getBadgeClassName(announcement.announcementType)}
            >
              {announcement.announcementType}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 whitespace-nowrap md:ml-auto">
            {formattedDate}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 break-words">
          {announcement.content}
        </p>
      </div>

      {/* Right side - Buttons */}
      <div className="flex items-center gap-2 md:ml-4 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-600 hover:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Archive announcement (Coming soon)"
        >
          <Archive className="!h-5 !w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-blue-600 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Edit announcement (Coming soon)"
        >
          <SquarePen className="!h-5 !w-5" />
        </Button>
      </div>
    </div>
  );
}
