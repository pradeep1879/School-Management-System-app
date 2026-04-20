import { Clock3, MapPin, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TimetableSlot } from "../types";
import {
  buildTimetableRows,
  DAY_LABELS,
  formatTimeRange,
  getTimeRangeKey,
  isCurrentSlot,
  SHORT_DAY_LABELS,
} from "../utils";

type TimetableGridProps = {
  slots: TimetableSlot[];
  role: "admin" | "teacher" | "student";
  selectedDay: number;
  onSelectDay: (value: number) => void;
  onEdit?: (slot: TimetableSlot) => void;
  onDelete?: (slotId: string) => void;
};

const TimetableSlotCard = ({
  slot,
  role,
  onEdit,
  onDelete,
}: {
  slot: TimetableSlot;
  role: TimetableGridProps["role"];
  onEdit?: (slot: TimetableSlot) => void;
  onDelete?: (slotId: string) => void;
}) => {
  const active = isCurrentSlot(slot);
  const roomLabel = slot.room || slot.subject.room || "Room TBA";

  return (
    <div
      className={cn(
        "group relative flex min-h-34 flex-col rounded-2xl border border-border/70 bg-secondary p-4 text-left shadow-sm",
        active && "border-primary/35"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="wrap-break-word text-base font-semibold leading-tight text-foreground">
            {slot.subject.name}
          </p>
          <p className="text-md lg:text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {slot.class.slug}-{slot.class.section} · {slot.class.session}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {role === "admin" && onEdit && onDelete ? (
            <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => onEdit(slot)}
                aria-label="Edit timetable slot"
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full text-destructive/80 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onDelete(slot.id)}
                aria-label="Delete timetable slot"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : null}

          {active ? (
            <Badge className="rounded-full border border-primary/20 bg-primary/10 px-2 py-0.5 text-[10px] text-primary">
              Live
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2 lg:gap-1">
          <Clock3 className="h-4 lg:h-3 w-4 lg:w-3 shrink-0" />
          <span className="wrap-break-word text-md lg:text-[10px] font-medium">{formatTimeRange(slot.startTime, slot.endTime)}</span>
        </div>

        <div className="flex items-center gap-2 lg:gap-1">
          <MapPin className="h-4 lg:h-3 w-4 lg:w-3 shrink-0" />
          <span className="wrap-break-word text-md lg:text-[10px]">{roomLabel}</span>
        </div>

        <p className="text-sm font-medium text-foreground/85">
          {slot.teacher.teacherName}
        </p>
      </div>
    </div>
  );
};

export const TimetableGrid = ({
  slots,
  role,
  selectedDay,
  onSelectDay,
  onEdit,
  onDelete,
}: TimetableGridProps) => {
  const rows = buildTimetableRows(slots);

  return (
    <div className="space-y-4">
      {/* MOBILE */}
      <div className="custom-div-scroll -mx-1 flex gap-2 px-1 lg:hidden">
        {SHORT_DAY_LABELS.map((day, index) => (
          <Button
            key={day}
            type="button"
            variant={selectedDay === index ? "default" : "outline"}
            className="rounded-xl px-4"
            onClick={() => onSelectDay(index)}
          >
            {day}
          </Button>
        ))}
      </div>

      <div className="space-y-3 lg:hidden">
        <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Selected Day
          </p>
          <p className="text-lg font-semibold">
            {DAY_LABELS[selectedDay]}
          </p>
        </div>

        {slots
          .filter((slot) => slot.dayOfWeek === selectedDay)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
          .map((slot) => (
            <TimetableSlotCard
              key={slot.id}
              slot={slot}
              role={role}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}

        {!slots.some((s) => s.dayOfWeek === selectedDay) && (
          <Card className="rounded-xl border-dashed bg-muted/15">
            <CardContent className="p-6 text-sm text-muted-foreground">
              No classes scheduled.
            </CardContent>
          </Card>
        )}
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:block">
        <div className="custom-div-scroll rounded-3xl border border-border/60 bg-card shadow-sm">
          <div className="min-w-345">

            {/* HEADER */}
            <div className="grid grid-cols-[190px_repeat(7,minmax(170px,1fr))] border-b border-border/60 bg-muted/20">
              <div className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                Time
              </div>

              {DAY_LABELS.map((day) => (
                <div
                  key={day}
                  className="border-l border-border/50 px-6 py-4 text-sm font-semibold text-foreground/90"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* ROWS */}
            {rows.map((rowKey) => {
              const [startTime, endTime] = rowKey.split("-");

              return (
                <div
                  key={rowKey}
                  className="grid grid-cols-[190px_repeat(7,minmax(170px,1fr))] border-b border-border/50 last:border-b-0"
                >
                  {/* TIME */}
                  <div className="flex items-center px-6 py-6 text-base font-semibold text-muted-foreground">
                    {formatTimeRange(startTime, endTime)}
                  </div>

                  {/* CELLS */}
                  {DAY_LABELS.map((_, dayIndex) => {
                    const slot = slots.find(
                      (s) =>
                        s.dayOfWeek === dayIndex &&
                        getTimeRangeKey(s) === rowKey
                    );

                    return (
                      <div
                        key={`${rowKey}-${dayIndex}`}
                        className="border-l border-border/50 p-4"
                      >
                        {slot ? (
                          <TimetableSlotCard
                            slot={slot}
                            role={role}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        ) : (
                          <div className="flex min-h-34 flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 bg-muted/10 px-4 text-center">
                            <span className="text-sm font-medium text-muted-foreground">
                              Free
                            </span>
                            <span className="mt-1 text-xs text-muted-foreground/70">
                              No class scheduled
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {!rows.length && (
              <div className="p-8 text-sm text-muted-foreground">
                No timetable slots yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
