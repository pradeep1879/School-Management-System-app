import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCompactClassLabel } from "@/features/class/utils/classLabels";
import {
  useCreateCalendarEvent,
  useUpdateCalendarEvent,
} from "../hooks/useCalendar";
import type { CalendarEventItem } from "../types";

type FormValues = {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: CalendarEventItem["type"];
  classId: string;
};

type CalendarEventDialogProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  event?: CalendarEventItem | null;
  classes: any[];
};

export const CalendarEventDialog = ({
  open,
  onOpenChange,
  event,
  classes,
}: CalendarEventDialogProps) => {
  const createMutation = useCreateCalendarEvent();
  const updateMutation = useUpdateCalendarEvent();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      startDate: event ? event.startDate.slice(0, 16) : "",
      endDate: event ? event.endDate.slice(0, 16) : "",
      type: event?.type || "EVENT",
      classId: event?.classId || "ALL",
    },
  });

  useEffect(() => {
    reset({
      title: event?.title || "",
      description: event?.description || "",
      startDate: event ? event.startDate.slice(0, 16) : "",
      endDate: event ? event.endDate.slice(0, 16) : "",
      type: event?.type || "EVENT",
      classId: event?.classId || "ALL",
    });
  }, [event, open, reset]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      title: values.title.trim(),
      description: values.description.trim() || null,
      startDate: new Date(values.startDate).toISOString(),
      endDate: new Date(values.endDate).toISOString(),
      type: values.type,
      classId: values.classId === "ALL" ? null : values.classId,
    };

    if (event) {
      await updateMutation.mutateAsync({ id: event.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-scrollbar max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event ? "Edit calendar event" : "Create calendar event"}</DialogTitle>
        </DialogHeader>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input {...register("title", { required: "Title is required" })} placeholder="Annual day, holiday, exam week..." />
            {errors.title ? <p className="text-xs text-destructive">{errors.title.message}</p> : null}
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea {...register("description")} rows={4} placeholder="Add context, schedule notes, or reminders..." />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Start</Label>
              <Input type="datetime-local" {...register("startDate", { required: "Start date is required" })} />
            </div>

            <div className="space-y-2">
              <Label>End</Label>
              <Input type="datetime-local" {...register("endDate", { required: "End date is required" })} />
            </div>

            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select value={watch("type")} onValueChange={(value) => setValue("type", value as CalendarEventItem["type"])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {["HOLIDAY", "EXAM", "EVENT", "NOTICE"].map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Visibility</Label>
              <Select value={watch("classId")} onValueChange={(value) => setValue("classId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Entire school or specific class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Entire school</SelectItem>
                  {classes.map((classItem: any) => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {formatCompactClassLabel(classItem)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : event ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
