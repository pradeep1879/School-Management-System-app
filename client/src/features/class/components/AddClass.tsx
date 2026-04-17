import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useCreateClass } from "../hooks/useCreateClass";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTeachers } from "@/features/teacher/hooks/useTeacher";

interface AddClassProps {
  setOpen: (value: boolean) => void;
}

interface ClassFormData {
  slug: string;
  section?: string;
  session?: string;
  teacherId?: string;
}

const AddClass = ({ setOpen }: AddClassProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ClassFormData>();

  const { mutate, isPending } = useCreateClass();
  const { data: teachersData } = useTeachers(1, 100);

  const onSubmit = (data: ClassFormData) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Class</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FieldGroup>
          {/* Class Name */}
          <Field>
            <FieldLabel>Class Name</FieldLabel>
            <Input
              {...register("slug", {
                required: "Class name is required",
              })}
              disabled={isPending}
              placeholder="e.g. 10"
            />
            {errors.slug && (
              <FieldDescription className="text-red-500">
                {errors.slug.message}
              </FieldDescription>
            )}
          </Field>

          {/* Section */}
          <Field>
            <FieldLabel>Section</FieldLabel>
            <Input
              {...register("section")}
              disabled={isPending}
              placeholder="e.g. A"
            />
          </Field>

          {/* Session */}
          <Field>
            <FieldLabel>Session</FieldLabel>
            <Input
              {...register("session")}
              disabled={isPending}
              placeholder="2024-2025"
            />
          </Field>

          {/* Assign Teacher */}
          <Field>
            <FieldLabel>Assign Teacher</FieldLabel>

            <Select
              onValueChange={(value) => setValue("teacherId", value)}
              disabled={isPending}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select teacher" />
              </SelectTrigger>

              <SelectContent>
                {teachersData?.teachers?.map((teacher: any) => (
                  <SelectItem key={teacher.id} value={teacher.id}>
                    {teacher.teacherName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <FieldDescription>Optional: You can assign later</FieldDescription>
          </Field>

          {/* Buttons */}
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Creating" : "Create Class"}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </DialogContent>
  );
};

export default AddClass;
