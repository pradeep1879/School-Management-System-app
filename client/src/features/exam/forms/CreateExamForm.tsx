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
import { Loader2, Trash2, Plus } from "lucide-react";

import { useCreateExam } from "../hooks/useExam";
import { useSubjects } from "@/features/subject/hooks/useSubjects";

type SubjectRow = {
  subjectId: string;
  totalMarks: number;
  passingMarks: number;
  syllabus: string;
};

type FormValues = {
  title: string;
  examType: string;
  startDate: string;
  subjects: SubjectRow[];
};

export default function AddExamDialog({
  classId,
  setOpen,
}: {
  classId: string;
  setOpen: (value: boolean) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      subjects: [
        {
          subjectId: "",
          totalMarks: 0,
          passingMarks: 0,
          syllabus: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subjects",
  });

  const { data } = useSubjects(classId);
  const subjects = data?.subjects || [];

  const createExamMutation = useCreateExam(classId);

  const onSubmit = (formData: FormValues) => {
    createExamMutation.mutate(
      {
        ...formData,
        classId,
        subjects: formData.subjects.map((sub) => ({
          subjectId: sub.subjectId,
          totalMarks: Number(sub.totalMarks),
          passingMarks: Number(sub.passingMarks),
          syllabus: sub.syllabus,
        })),
      },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto custom-scrollbar">
      <DialogHeader>
        <DialogTitle>Create New Exam</DialogTitle>
        <DialogDescription>
          Add exam details, subjects and syllabus
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4 ">

        {/* Exam Info */}

        <div className="space-y-4">
          <Input
            placeholder="Exam Title"
            {...register("title", { required: true })}
          />

          <Select
            onValueChange={(value) =>
              setValue("examType", value, { shouldValidate: true })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Exam Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UNIT">Unit</SelectItem>
              <SelectItem value="MIDTERM">Midterm</SelectItem>
              <SelectItem value="FINAL">Final</SelectItem>
              <SelectItem value="PRACTICAL">Practical</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            {...register("startDate", { required: true })}
          />
        </div>

        {/*  Subjects Section */}

        <div className="space-y-4">
          <h4 className="font-medium text-sm">Subjects</h4>

          {fields.map((field:any, index:any) => (
            <div
              key={field.id}
              className="border rounded-lg p-4 space-y-3 bg-muted/20"
            >
              <div className="grid grid-cols-12 gap-3 items-center">
                {/* Subject */}
                <div className="col-span-4">
                  <Select
                    onValueChange={(value) =>
                      setValue(
                        `subjects.${index}.subjectId`,
                        value,
                        { shouldValidate: true }
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject: any) => (
                        <SelectItem
                          key={subject.id}
                          value={subject.id}
                        >
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Total Marks */}

                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Total Marks"
                    {...register(
                      `subjects.${index}.totalMarks`,
                      { required: true }
                    )}
                  />
                </div>

                {/* Passing Marks */}

                <div className="col-span-3">
                  <Input
                    type="number"
                    placeholder="Passing Marks"
                    {...register(
                      `subjects.${index}.passingMarks`,
                      { required: true }
                    )}
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

              {/*  Syllabus Field */}
              
              <Input
                placeholder="Syllabus (e.g., Chapter 1-3, Algebra & Geometry)"
                {...register(`subjects.${index}.syllabus`)}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                subjectId: "",
                totalMarks: 0,
                passingMarks: 0,
                syllabus: "",
              })
            }
            className="gap-2"
          >
            <Plus size={14} />
            Add Subject
          </Button>
        </div>

        {/* ================= Submit ================= */}
        <Button
          type="submit"
          className="w-full"
          disabled={createExamMutation.isPending}
        >
          {createExamMutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating
            </span>
          ) : (
            "Create Exam"
          )}
        </Button>
      </form>
    </DialogContent>
  );
}