import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CalendarEventItem } from "../types";
import {
  buildWeekDays,
  EVENT_TYPE_STYLES,
  format,
  getEventsForDay,
  isSameDay,
  isToday,
} from "../utils";

type CalendarWeekViewProps = {
  date: Date;
  events: CalendarEventItem[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
};

export const CalendarWeekView = ({
  date,
  events,
  selectedDate,
  onSelectDate,
}: CalendarWeekViewProps) => {
  const days = buildWeekDays(date);

  return (
    <div className="grid gap-3 xl:grid-cols-7 xl:gap-4">
      {days.map((day) => {
        const dayEvents = getEventsForDay(events, day);

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "rounded-2xl border p-3 sm:rounded-3xl sm:p-4",
              isSameDay(day, selectedDate) && "border-primary bg-primary/5",
            )}
          >
            <button type="button" className="w-full text-left" onClick={() => onSelectDate(day)}>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {format(day, "EEE")}
              </p>
              <p className={cn("mt-1 text-xl font-semibold sm:text-2xl", isToday(day) && "text-primary")}>
                {format(day, "d")}
              </p>
            </button>

            <div className="mt-3 space-y-2 sm:mt-4">
              {dayEvents.length ? (
                dayEvents.map((event) => (
                  <div key={event.id} className={cn("rounded-2xl border px-3 py-2", EVENT_TYPE_STYLES[event.type])}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold leading-snug">{event.title}</p>
                      <Badge variant="secondary" className="w-fit rounded-full text-[10px]">
                        {event.type}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs opacity-80">{format(new Date(event.startDate), "p")}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
                  No events
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
