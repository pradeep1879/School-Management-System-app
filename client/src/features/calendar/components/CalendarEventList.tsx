import { Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { CalendarEventItem } from "../types";
import { EVENT_TYPE_STYLES, format } from "../utils";

type CalendarEventListProps = {
  title: string;
  events: CalendarEventItem[];
  canManage: boolean;
  onEdit?: (event: CalendarEventItem) => void;
  onDelete?: (eventId: string) => void;
};

export const CalendarEventList = ({
  title,
  events,
  canManage,
  onEdit,
  onDelete,
}: CalendarEventListProps) => {
  return (
    <Card className="rounded-3xl bg-card/80">
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length ? (
          events.map((event) => (
            <div key={event.id} className={cn("rounded-2xl border p-4", EVENT_TYPE_STYLES[event.type])}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="break-words font-semibold">{event.title}</p>
                    <Badge variant="secondary" className="rounded-full text-[10px]">
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-xs opacity-80">
                    {format(new Date(event.startDate), "MMM d, yyyy p")} - {format(new Date(event.endDate), "MMM d, yyyy p")}
                  </p>
                  {event.class ? (
                    <p className="text-xs opacity-80">
                      {event.class.slug} - {event.class.section} · {event.class.session}
                    </p>
                  ) : (
                    <p className="text-xs opacity-80">Entire school</p>
                  )}
                  {event.description ? <p className="pt-1 text-sm">{event.description}</p> : null}
                </div>

                {canManage && onEdit && onDelete ? (
                  <div className="flex shrink-0 gap-2 self-start">
                    <Button type="button" variant="outline" size="icon" onClick={() => onEdit(event)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="destructive" size="icon" onClick={() => onDelete(event.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
            No events available for this range.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
