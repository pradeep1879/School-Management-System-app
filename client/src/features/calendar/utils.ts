import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import type { CalendarEventItem } from "./types";

export const EVENT_TYPE_STYLES: Record<CalendarEventItem["type"], string> = {
  HOLIDAY: "border-red-200 bg-red-50 text-red-700",
  EXAM: "border-amber-200 bg-amber-50 text-amber-700",
  EVENT: "border-sky-200 bg-sky-50 text-sky-700",
  NOTICE: "border-violet-200 bg-violet-50 text-violet-700",
};

export const buildMonthDays = (date: Date) =>
  eachDayOfInterval({
    start: startOfWeek(startOfMonth(date), { weekStartsOn: 0 }),
    end: endOfWeek(endOfMonth(date), { weekStartsOn: 0 }),
  });

export const buildWeekDays = (date: Date) =>
  eachDayOfInterval({
    start: startOfWeek(date, { weekStartsOn: 0 }),
    end: endOfWeek(date, { weekStartsOn: 0 }),
  });

export const getEventsForDay = (events: CalendarEventItem[], day: Date) =>
  events.filter((event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    return start <= day && end >= day;
  });

export const formatCalendarTitle = (date: Date, view: "month" | "week") =>
  view === "month"
    ? format(date, "MMMM yyyy")
    : `${format(startOfWeek(date), "MMM d")} - ${format(endOfWeek(date), "MMM d, yyyy")}`;

export { format, isSameDay, isSameMonth, isToday };
