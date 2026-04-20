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
import { useSubjects } from "@/features/subject/hooks/useSubjects";
import { useTeachers } from "@/features/teacher/hooks/useTeacher";
import {
  useCreateTimetableSlot,
  useUpdateTimetableSlot,
} from "../hooks/useTimetable";
import type { TimetableSlot } from "../types";

type FormValues = {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
  room: string;
};

type TimetableSlotDialogProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  classId: string;
  slot?: TimetableSlot | null;
};

export const TimetableSlotDialog = ({
  open,
  onOpenChange,
  classId,
  slot,
}: TimetableSlotDialogProps) => {
  const createMutation = useCreateTimetableSlot();
  const updateMutation = useUpdateTimetableSlot();
  const { data: subjectsData } = useSubjects(classId);
  const { data: teachersData } = useTeachers(1, 100);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      dayOfWeek: slot ? String(slot.dayOfWeek) : "1",
      startTime: slot?.startTime || "09:00",
      endTime: slot?.endTime || "10:00",
      subjectId: slot?.subject.id || "",
      teacherId: slot?.teacher.id || "",
      room: slot?.room || "",
    },
  });

  useEffect(() => {
    reset({
      dayOfWeek: slot ? String(slot.dayOfWeek) : "1",
      startTime: slot?.startTime || "09:00",
      endTime: slot?.endTime || "10:00",
      subjectId: slot?.subject.id || "",
      teacherId: slot?.teacher.id || "",
      room: slot?.room || "",
    });
  }, [slot, reset, open]);

  const onSubmit = handleSubmit(async (values) => {
    const payload = {
      classId,
      dayOfWeek: Number(values.dayOfWeek),
      startTime: values.startTime,
      endTime: values.endTime,
      subjectId: values.subjectId,
      teacherId: values.teacherId,
      room: values.room.trim() || null,
    };

    if (slot) {
      await updateMutation.mutateAsync({ id: slot.id, data: payload });
    } else {
      await createMutation.mutateAsync(payload);
    }

    onOpenChange(false);
  });

  const isPending = createMutation.isPending || updateMutation.isPending;
  const subjects = subjectsData?.subjects || [];
  const teachers = teachersData?.teachers || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="custom-scrollbar max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{slot ? "Edit timetable slot" : "Create timetable slot"}</DialogTitle>
        </DialogHeader>

        <form className="space-y-5" onSubmit={onSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Day</Label>
              <Select value={watch("dayOfWeek")} onValueChange={(value) => setValue("dayOfWeek", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(
                    (day, index) => (
                      <SelectItem key={day} value={String(index)}>
                        {day}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Room</Label>
              <Input placeholder="Room / Lab / Hall" {...register("room")} />
            </div>

            <div className="space-y-2">
              <Label>Start time</Label>
              <Input type="time" {...register("startTime", { required: "Start time is required" })} />
              {errors.startTime ? <p className="text-xs text-destructive">{errors.startTime.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label>End time</Label>
              <Input type="time" {...register("endTime", { required: "End time is required" })} />
              {errors.endTime ? <p className="text-xs text-destructive">{errors.endTime.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={watch("subjectId")} onValueChange={(value) => setValue("subjectId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject: any) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Teacher</Label>
              <Select value={watch("teacherId")} onValueChange={(value) => setValue("teacherId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher: any) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.teacherName}
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
            <Button
              type="submit"
              disabled={
                isPending || !watch("subjectId") || !watch("teacherId") || !watch("startTime") || !watch("endTime")
              }
            >
              {isPending ? "Saving..." : slot ? "Update slot" : "Create slot"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
