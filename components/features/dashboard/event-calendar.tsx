"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,

  isToday,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useAdminCalendarQuery,
  useSuperadminCalendarQuery,
} from "@/lib/api/queries/dashboardQueries";
import type { CalendarEvent } from "@/lib/api/services/dashboardServices";
import { UserType } from "@/lib/types/user-type";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EventCalendarProps {
  role: UserType;
}

export function EventCalendar({ role }: EventCalendarProps) {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());

  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const isAdmin = role === UserType.ADMIN;

  const adminCalendar = useAdminCalendarQuery(month, year);
  const superadminCalendar = useSuperadminCalendarQuery(month, year);

  const { data: events = [], isLoading } = isAdmin
    ? superadminCalendar
    : adminCalendar;

  const goToPrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  // Build calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get events for a specific day
  const getEventsForDay = (date: Date): CalendarEvent[] => {
    return events.filter((event) => {
      const eventStart = parseISO(event.dateStart);
      const eventEnd = parseISO(event.dateEnd);
      return date >= new Date(eventStart.toDateString()) && date <= new Date(eventEnd.toDateString());
    });
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          {isAdmin ? "Global Events Calendar" : "Events Calendar"}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="text-sm"
          >
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={goToPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-medium min-w-[160px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
        {/* Week day headers */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-blue-900 to-blue-700">
          {weekDays.map((weekDay) => (
            <div
              key={weekDay}
              className="p-3 text-center text-sm font-semibold text-white"
            >
              {weekDay}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        {isLoading ? (
          <div className="h-[500px] flex items-center justify-center">
            <div className="animate-pulse text-gray-400">
              Loading calendar...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={index}
                  className={`min-h-[100px] border-t border-r border-gray-100 p-1.5 transition-colors ${
                    !isCurrentMonth ? "bg-gray-50/50" : "bg-white"
                  } ${index % 7 === 6 ? "border-r-0" : ""}`}
                >
                  {/* Day number */}
                  <div className="flex justify-end mb-1">
                    <span
                      className={`text-sm w-7 h-7 flex items-center justify-center rounded-full ${
                        isTodayDate
                          ? "bg-blue-600 text-white font-bold"
                          : isCurrentMonth
                            ? "text-gray-900"
                            : "text-gray-300"
                      }`}
                    >
                      {format(day, "d")}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <Tooltip key={event.id} delayDuration={200}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleEventClick(event.id)}
                            className={`w-full text-left text-xs px-1.5 py-0.5 rounded truncate transition-opacity hover:opacity-80 ${
                              event.isPublished
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-gray-100 text-gray-500 border border-dashed border-gray-300"
                            }`}
                          >
                            {event.name}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="top"
                          className="bg-gray-900 text-white max-w-[250px]"
                        >
                          <div className="space-y-1">
                            <p className="font-semibold">{event.name}</p>
                            <p className="text-xs opacity-80">
                              {format(parseISO(event.dateStart), "MMM d, h:mm a")} —{" "}
                              {format(parseISO(event.dateEnd), "MMM d, h:mm a")}
                            </p>
                            {event.org && (
                              <p className="text-xs opacity-70">
                                {event.org.name}
                              </p>
                            )}
                            {!event.isPublished && (
                              <p className="text-xs text-yellow-300">Draft</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    {dayEvents.length > 3 && (
                      <p className="text-xs text-gray-400 pl-1.5">
                        +{dayEvents.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-100 border border-blue-200" />
          Published
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-gray-100 border border-dashed border-gray-300" />
          Draft
        </div>
      </div>
    </section>
  );
}
