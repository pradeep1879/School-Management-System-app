import { Clock3 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth.store";
import { useMyTimetable } from "../hooks/useTimetable";
import { formatTimeRange, getTodaySlots, isCurrentSlot } from "../utils";

type TodayScheduleWidgetProps = {
  title?: string;
};

export const TodayScheduleWidget = ({
  title = "Today's Schedule",
}: TodayScheduleWidgetProps) => {
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);
  const { data, isLoading } = useMyTimetable(true);

  if (isLoading) {
    return <Skeleton className="h-64 w-full rounded-3xl" />;
  }

  const scopedSlots =
    role === "teacher"
      ? (data?.slots || []).filter((slot) => slot.teacher.id === userId)
      : data?.slots || [];

  const slots = getTodaySlots(scopedSlots);

  return (
    <Card className="rounded-3xl bg-card/80">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {slots.length ? (
          slots.map((slot) => (
            <div
              key={slot.id}
              className={`rounded-2xl border p-4 ${
                isCurrentSlot(slot)
                  ? "border-primary/50 bg-primary/5"
                  : "border-border/60 bg-background/60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{slot.subject.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {slot.class.slug} - {slot.class.section}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock3 className="h-4 w-4" />
                  {formatTimeRange(slot.startTime, slot.endTime)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
            No classes scheduled for you today.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
