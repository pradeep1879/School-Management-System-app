import { useForm, useFieldArray } from "react-hook-form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2, } from "lucide-react";


import { useSubjects } from "@/features/subject/hooks/useSubjects";
import { useCreateHomework } from "../hooks/useHomeWork";

type SubjectRow = {
  subjectId: string;
  description: string;
};

type FormValues = {
  title: string;
  dueDate: string;
  subjects: SubjectRow[];
};

export default function CreateHomeworkDialog({
  classId,
  setOpen,
}: {
  classId: string;
  setOpen: (value: boolean) => void;
}) {
  const { register, control, handleSubmit, reset, setValue } =
    useForm<FormValues>({
      defaultValues: {
        subjects: [{ subjectId: "" }],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });

  const { data } = useSubjects(classId);
  const subjects = data?.subjects || [];

  const createMutation = useCreateHomework(classId);

  const onSubmit = (formData: FormValues) => {
    createMutation.mutate(
      {
        title: formData.title,
        dueDate: formData.dueDate,
        classId,
        subjects: formData.subjects.map((sub) => ({
          subjectId: sub.subjectId,
          description: sub.description,
        })),
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      },
    );
  };

  return (
    <DialogContent className="sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle>Create New Homework</DialogTitle>
        <DialogDescription>
          Assign homework to multiple subjects
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
        {/* ================= Homework Info ================= */}
        <div className="space-y-4">
          <Input
            placeholder="Homework Title"
            {...register("title", { required: true })}
          />

          <Input type="date" {...register("dueDate", { required: true })} />
        </div>

        {/* ================= Subjects Section ================= */}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border rounded-lg p-4 space-y-3 bg-muted/20"
          >
            <div className="grid grid-cols-12 gap-3 items-center">
              {/* Subject */}
              <div className="col-span-4">
                <Select
                  onValueChange={(value) =>
                    setValue(`subjects.${index}.subjectId`, value, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Subject" />
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

              {/* Description */}
              <div className="col-span-6">
                <Input
                  placeholder="Subject Description"
                  {...register(`subjects.${index}.description`, {
                    required: true,
                  })}
                />
              </div>

              {/* Remove */}
              <div className="col-span-2 text-right">
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => remove(index)}
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              subjectId: "",
              description: "",
            })
          }
          className="w-full"
        >
          + Add Another Subject
      </Button>

        {/* ================= Submit ================= */}
        <Button
          type="submit"
          className="w-full"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating
            </span>
          ) : (
            "Create Homework"
          )}
        </Button>
      </form>
    </DialogContent>
  );
}
