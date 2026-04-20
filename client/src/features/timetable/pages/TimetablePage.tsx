import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";

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
import { useAuthStore } from "@/store/auth.store";
import { TimetableGrid } from "../components/TimetableGrid";
import { TimetableSlotDialog } from "../components/TimetableSlotDialog";
import {
  useClassTimetable,
  useDeleteTimetableSlot,
  useMyTimetable,
} from "../hooks/useTimetable";
import { useTimetableStore } from "../store/timetable.store";
import type { TimetableSlot } from "../types";
import { DAY_LABELS, getTimetableTitle } from "../utils";

const summaryLabel = (slots: TimetableSlot[]) => {
  const activeDays = new Set(slots.map((slot) => slot.dayOfWeek)).size;
  return [
    { title: "Weekly Slots", value: slots.length },
    { title: "Active Days", value: activeDays },
    { title: "Earliest Start", value: slots[0]?.startTime || "--:--" },
  ];
};

export default function TimetablePage() {
  const role = useAuthStore((state) => state.role);
  const isAdmin = role === "admin";
  const { selectedClassId, setSelectedClassId, selectedDay, setSelectedDay } = useTimetableStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<TimetableSlot | null>(null);

  const { data: classDropdown, isLoading: classLoading } = useClassDropdown(isAdmin);
  const { data: myTimetable, isLoading: myLoading } = useMyTimetable(!isAdmin);
  const { data: classTimetable, isLoading: classTimetableLoading } = useClassTimetable(
    isAdmin ? selectedClassId : undefined,
  );
  const deleteMutation = useDeleteTimetableSlot();

  useEffect(() => {
    if (isAdmin && !selectedClassId && classDropdown?.classes?.length) {
      setSelectedClassId(classDropdown.classes[0].id);
    }
  }, [classDropdown, isAdmin, selectedClassId, setSelectedClassId]);

  const selectedClass = useMemo(() => {
    if (isAdmin) {
      return classDropdown?.classes?.find((item: any) => item.id === selectedClassId);
    }

    return myTimetable?.class;
  }, [classDropdown, isAdmin, myTimetable, selectedClassId]);

  const slots = (isAdmin ? classTimetable?.slots : myTimetable?.slots) || [];
  const loading = isAdmin ? classTimetableLoading || classLoading : myLoading;
  const sortedSlots = [...slots].sort((left, right) => {
    if (left.dayOfWeek !== right.dayOfWeek) {
      return left.dayOfWeek - right.dayOfWeek;
    }

    return left.startTime.localeCompare(right.startTime);
  });

  const headerTitle = getTimetableTitle(sortedSlots, isAdmin ? "Class timetable" : "Your timetable");

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? "Create and manage recurring weekly schedules for every class."
              : "Track your recurring weekly schedule with live current-period highlighting."}
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
              disabled={!selectedClassId}
              onClick={() => {
                setEditingSlot(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Slot
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-4 grid-cols-3">
        {summaryLabel(sortedSlots).map((item) => (
          <Card key={item.title} className="rounded-3xl bg-card/75">
            <CardContent className="p-5">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                {item.title}
              </p>
              <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-3xl border bg-card/80 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>{headerTitle}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                {isAdmin
                  ? "Choose a class, then add recurring slots with conflict-safe validation."
                  : "This timetable updates automatically based on your class and teaching assignments."}
              </p>
            </div>

            {isAdmin ? (
              <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                <SelectTrigger className="w-full rounded-2xl sm:w-[320px]">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classDropdown?.classes?.map((classItem: any) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {formatCompactClassLabel(classItem)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-14 w-full rounded-2xl lg:hidden" />
              <Skeleton className="h-[520px] w-full rounded-3xl" />
            </div>
          ) : sortedSlots.length ? (
            <TimetableGrid
              slots={sortedSlots}
              role={(role || "student") as "admin" | "teacher" | "student"}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              onEdit={(slot) => {
                setEditingSlot(slot);
                setDialogOpen(true);
              }}
              onDelete={(slotId) => deleteMutation.mutate(slotId)}
            />
          ) : (
            <div className="rounded-3xl border border-dashed bg-background/40 p-10 text-center">
              <p className="text-lg font-semibold">No timetable published yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {isAdmin
                  ? "Create the first slot to start building a recurring weekly schedule."
                  : `No classes are scheduled for ${DAY_LABELS[selectedDay]} right now.`}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {isAdmin ? (
        <TimetableSlotDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          classId={selectedClassId}
          slot={editingSlot}
        />
      ) : null}
    </div>
  );
}
