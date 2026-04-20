import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CalendarEventItem } from "../types";
import {
  buildMonthDays,
  EVENT_TYPE_STYLES,
  format,
  getEventsForDay,
  isSameDay,
  isSameMonth,
  isToday,
} from "../utils";

type CalendarMonthGridProps = {
  date: Date;
  events: CalendarEventItem[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

export const CalendarMonthGrid = ({
  date,
  events,
  selectedDate,
  onSelectDate,
}: CalendarMonthGridProps) => {
  const days = buildMonthDays(date);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground sm:gap-2 sm:text-xs sm:tracking-[0.2em]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day) => {
          const dayEvents = getEventsForDay(events, day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDate(day)}
              className={cn(
                "min-h-18 rounded-xl border p-1.5 text-left transition hover:border-primary/40 hover:bg-muted/30 sm:min-h-32 sm:rounded-2xl sm:p-2",
                !isSameMonth(day, date) && "opacity-45",
                isSameDay(day, selectedDate) && "border-primary bg-primary/5",
                isToday(day) && "ring-1 ring-primary/30",
              )}
            >
              <div className="mb-1 flex items-center justify-between sm:mb-2">
                <span className="text-xs font-semibold sm:text-sm">{format(day, "d")}</span>
                {dayEvents.length ? (
                  <Badge variant="secondary" className="rounded-full px-1.5 py-0 text-[9px] sm:px-2 sm:py-0.5 sm:text-[10px]">
                    {dayEvents.length}
                  </Badge>
                ) : null}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap gap-1 sm:hidden">
                  {dayEvents.slice(0, 3).map((event) => (
                    <span
                      key={event.id}
                      className={cn("h-1.5 w-1.5 rounded-full", {
                        "bg-red-500": event.type === "HOLIDAY",
                        "bg-amber-500": event.type === "EXAM",
                        "bg-sky-500": event.type === "EVENT",
                        "bg-violet-500": event.type === "NOTICE",
                      })}
                    />
                  ))}
                </div>

                <div className="hidden space-y-1 sm:block">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "rounded-xl border px-2 py-1 text-[11px] font-medium line-clamp-2",
                        EVENT_TYPE_STYLES[event.type],
                      )}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 ? (
                    <p className="text-[11px] text-muted-foreground">+{dayEvents.length - 2} more</p>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
