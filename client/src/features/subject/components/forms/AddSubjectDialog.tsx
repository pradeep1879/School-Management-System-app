import { useForm } from "react-hook-form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateSubject } from "../../hooks/useSubjects";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeachers } from "@/features/teacher/hooks/useTeacher";

interface Props {
  classId: string;
  setOpen: (val: boolean) => void;
}

interface FormValues {
  name: string;
  code?: string;
  room?: string;
  periods?: number;
  teacherId?: string;
}

export default function AddSubjectDialog({
  classId,
  setOpen,
}: Props) {
  const { register, handleSubmit, reset, setValue } =
    useForm<FormValues>();

  const { mutate, isPending } = useCreateSubject();
  const { data, isLoading } = useTeachers(1, 100);

  const teachers = data?.teachers || [];
  

  const onSubmit = (formData: FormValues) => {
    mutate(
      { ...formData, classId },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add Subject</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("name")}
          placeholder="Subject Name"
          required
        />

        <Input
          {...register("code")}
          placeholder="Subject Code"
        />

        <Input
          {...register("room")}
          placeholder="Room"
        />

        <Input
          type="number"
          {...register("periods")}
          placeholder="Periods per week"
        />

        {/* Teacher Select */}
        <Field>
          <FieldLabel>Select Teacher</FieldLabel>

          <Select
            onValueChange={(value) =>
              setValue("teacherId", value)
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Teacher" />
            </SelectTrigger>

            <SelectContent>
              {teachers.map((teacher: any) => (
                <SelectItem
                  key={teacher.id}
                  value={teacher.id}
                >
                  {teacher.teacherName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
        >
          {isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isPending ? "Creating..." : "Create Subject"}
        </Button>
      </form>
    </DialogContent>
  );
}