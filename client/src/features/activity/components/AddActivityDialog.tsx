import { useForm } from "react-hook-form";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreateActivity } from "../hooks/useActivity";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  classId: string;
  setOpen: (val: boolean) => void;
}

interface FormValues {
  title: string;
  description?: string;
  type: string;
  status: string;
  priority: string;
  startDate: string;
  endDate?: string;
  location?: string;
  icon?: string;
  color?: string;
}

export default function AddActivityDialog({
  classId,
  setOpen,
}: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
  } = useForm<FormValues>();

  const { mutate, isPending } = useCreateActivity();

  const onSubmit = (data: FormValues) => {
    mutate(
      { ...data, classId },
      {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      }
    );
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Create Activity</DialogTitle>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        {/* Title */}
        <Field>
          <FieldLabel>Title</FieldLabel>
          <Input
            {...register("title")}
            placeholder="Activity title"
            required
          />
        </Field>

        {/* Description */}
        <Field>
          <FieldLabel>Description</FieldLabel>
          <Input
            {...register("description")}
            placeholder="Activity description"
          />
        </Field>

        {/* Type + Status */}
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Type</FieldLabel>
            <Select
              onValueChange={(v) =>
                setValue("type", v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HOMEWORK">Homework</SelectItem>
                <SelectItem value="EXAM">Exam</SelectItem>
                <SelectItem value="QUIZ">Quiz</SelectItem>
                <SelectItem value="EVENT">Event</SelectItem>
                <SelectItem value="ASSIGNMENT">
                  Assignment
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select
              onValueChange={(v) =>
                setValue("status", v)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">
                  Pending
                </SelectItem>
                <SelectItem value="ACTIVE">
                  Active
                </SelectItem>
                <SelectItem value="COMPLETED">
                  Completed
                </SelectItem>
                <SelectItem value="CANCELLED">
                  Cancelled
                </SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

      

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Start Date</FieldLabel>
            <Input
              type="date"
              {...register("startDate")}
              required
            />
          </Field>

          <Field>
            <FieldLabel>End Date</FieldLabel>
            <Input
              type="date"
              {...register("endDate")}
            />
          </Field>
        </div>

  

        {/* Icon + Color */}
        {/* <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel>Icon Name</FieldLabel>
            <Input
              {...register("icon")}
              placeholder="e.g. BookOpen"
            />
          </Field>

          <Field>
            <FieldLabel>Color</FieldLabel>
            <Input
              type="color"
              {...register("color")}
            />
          </Field>
        </div> */}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
        >
          {isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isPending
            ? "Creating"
            : "Create Activity"}
        </Button>
      </form>
    </DialogContent>
  );
}