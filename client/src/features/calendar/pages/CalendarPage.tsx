import { useEffect, useMemo, useState } from "react";
import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { Calendar1Icon, ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClassDropdown } from "@/features/class/hooks/useClassDropDown";
import { formatCompactClassLabel } from "@/features/class/utils/classLabels";
import { useTeacherClass } from "@/features/class/hooks/useTeacherClass";
import { useAuthStore } from "@/store/auth.store";
import { CalendarEventDialog } from "../components/CalendarEventDialog";
import { CalendarEventList } from "../components/CalendarEventList";
import { CalendarMonthGrid } from "../components/CalendarMonthGrid";
import { CalendarWeekView } from "../components/CalendarWeekView";
import { useCalendarEvents, useDeleteCalendarEvent } from "../hooks/useCalendar";
import { useMyTimetable } from "@/features/timetable/hooks/useTimetable";
import { useCalendarStore } from "../store/calendar.store";
import type { CalendarEventItem } from "../types";
import { buildWeekDays, formatCalendarTitle, getEventsForDay } from "../utils";

export default function CalendarPage() {
  const ALL_CLASSES_VALUE = "ALL_CLASSES";
  const role = useAuthStore((state) => state.role);
  const isAdmin = role === "admin";
  const isTeacher = role === "teacher";
  const { data: classDropdown } = useClassDropdown(isAdmin);
  const { data: teacherClass } = useTeacherClass(isTeacher);
  const { data: myTimetable } = useMyTimetable(!isAdmin);
  const {
    view,
    selectedDate,
    selectedClassId,
    setView,
    setSelectedDate,
    setSelectedClassId,
  } = useCalendarStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEventItem | null>(null);
  const deleteMutation = useDeleteCalendarEvent();

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    if (selectedClassId === ALL_CLASSES_VALUE) {
      return;
    }

    const hasMatchingClass = classDropdown?.classes?.some(
      (classItem: any) => classItem.id === selectedClassId,
    );

    if (classDropdown?.classes && !hasMatchingClass) {
      setSelectedClassId(ALL_CLASSES_VALUE);
    }
  }, [ALL_CLASSES_VALUE, classDropdown, isAdmin, selectedClassId, setSelectedClassId]);

  const rangeStart = view === "month" ? startOfMonth(selectedDate) : startOfWeek(selectedDate);
  const rangeEnd = view === "month" ? endOfMonth(selectedDate) : endOfWeek(selectedDate);

  const { data, isLoading } = useCalendarEvents({
    startDate: rangeStart.toISOString(),
    endDate: rangeEnd.toISOString(),
    ...(isAdmin && selectedClassId !== ALL_CLASSES_VALUE
      ? { classId: selectedClassId }
      : {}),
    ...(!isAdmin && (isTeacher ? teacherClass?.classDetail?.id : myTimetable?.class?.id)
      ? { classId: isTeacher ? teacherClass?.classDetail?.id : myTimetable?.class?.id }
      : {}),
  });

  const events = data?.events || [];
  const selectedDayEvents = useMemo(
    () => getEventsForDay(events, selectedDate),
    [events, selectedDate],
  );
  const weekHighlights = useMemo(
    () =>
      buildWeekDays(selectedDate).flatMap((day) => getEventsForDay(events, day)),
    [events, selectedDate],
  );

  const selectedClass = useMemo(() => {
    if (isAdmin) {
      if (selectedClassId === ALL_CLASSES_VALUE) {
        return null;
      }

      return classDropdown?.classes?.find((item: any) => item.id === selectedClassId);
    }

    if (isTeacher) {
      return teacherClass?.classDetail || myTimetable?.class || myTimetable?.slots?.[0]?.class || null;
    }

    return myTimetable?.class || myTimetable?.slots?.[0]?.class || null;
  }, [classDropdown, isAdmin, isTeacher, myTimetable, selectedClassId, teacherClass]);

  const movePrevious = () =>
    setSelectedDate(view === "month" ? subMonths(selectedDate, 1) : subWeeks(selectedDate, 1));

  const moveNext = () =>
    setSelectedDate(view === "month" ? addMonths(selectedDate, 1) : addWeeks(selectedDate, 1));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar1Icon className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Calendar</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Manage global and class-specific academic events with clean scheduling controls."
              : "Stay aligned with school events, holidays, notices, and exam timelines."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {selectedClass ? (
            <Badge variant="outline" className="w-fit rounded-full px-3 py-1">
              {formatCompactClassLabel(selectedClass)}
            </Badge>
          ) : null}

          {isAdmin ? (
            <Button
              type="button"
              className="rounded-2xl"
              onClick={() => {
                setEditingEvent(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="rounded-3xl border bg-card/80 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Button type="button" variant="outline" size="icon" className="rounded-2xl" onClick={movePrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-lg sm:text-2xl">{formatCalendarTitle(selectedDate, view)}</CardTitle>
              <Button type="button" variant="outline" size="icon" className="rounded-2xl" onClick={moveNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {isAdmin ? (
                <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                  <SelectTrigger className="w-full rounded-2xl sm:w-70">
                    <SelectValue placeholder="Filter by class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_CLASSES_VALUE}>All classes</SelectItem>
                    {classDropdown?.classes?.map((classItem: any) => (
                      <SelectItem key={classItem.id} value={classItem.id}>
                        {formatCompactClassLabel(classItem)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : null}

              <div className="flex rounded-2xl border border-border/70 p-1">
                <Button type="button" variant={view === "month" ? "default" : "ghost"} className="rounded-xl" onClick={() => setView("month")}>
                  Month
                </Button>
                <Button type="button" variant={view === "week" ? "default" : "ghost"} className="rounded-xl" onClick={() => setView("week")}>
                  Week
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <Skeleton className="h-135 w-full rounded-3xl" />
          ) : view === "month" ? (
            <CalendarMonthGrid
              date={selectedDate}
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          ) : (
            <CalendarWeekView
              date={selectedDate}
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr] xl:gap-6">
        <CalendarEventList
          title="Selected Day"
          events={selectedDayEvents}
          canManage={Boolean(isAdmin)}
          onEdit={(event) => {
            setEditingEvent(event);
            setDialogOpen(true);
          }}
          onDelete={(eventId) => deleteMutation.mutate(eventId)}
        />

        <CalendarEventList
          title={view === "month" ? "Month Snapshot" : "Week Snapshot"}
          events={view === "month" ? events : weekHighlights}
          canManage={false}
        />
      </div>

      {isAdmin ? (
        <CalendarEventDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          event={editingEvent}
          classes={classDropdown?.classes || []}
        />
      ) : null}
    </div>
  );
}
