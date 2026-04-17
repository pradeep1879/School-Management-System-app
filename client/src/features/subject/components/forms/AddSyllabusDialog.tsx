import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, Loader2 } from "lucide-react";
import { useCreateSyllabus } from "../../hooks/useSyllabus";

interface Props {
  subjectId: string;
  onSuccess?: () => void;
}

interface FormValues {
  chapters: {
    title: string;
    description: string;
  }[];
}

export default function AddSyllabusDialog({
  subjectId,
  onSuccess,
}: Props) {
  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      chapters: [{ title: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "chapters",
  });

  const createMutation = useCreateSyllabus(subjectId);

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(
      {
        subjectId,
        chapters: data.chapters,
      },
      {
        onSuccess: () => {
          reset();
          onSuccess?.(); // close dialog
        },
      }
    );
  };

  return (
    <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
      <DialogHeader>
        <DialogTitle>Add Syllabus</DialogTitle>
        <DialogDescription>
          Add multiple chapters for this subject
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border p-4 rounded-lg space-y-3 bg-muted/30"
          >
            <Input
              placeholder="Chapter Title"
              {...register(`chapters.${index}.title`, {
                required: "Title is required",
              })}
            />

            <Textarea
              placeholder="Chapter Description"
              {...register(`chapters.${index}.description`, {
                required: "Description is required",
              })}
            />

            {fields.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => remove(index)}
              >
                <Trash size={16} />
              </Button>
            )}
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() => append({ title: "", description: "" })}
        >
          <Plus size={14} /> Add Chapter
        </Button>

        <Button
          type="submit"
          className="w-full"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving
            </span>
          ) : (
            "Save Syllabus"
          )}
        </Button>
      </form>
    </DialogContent>
  );
}