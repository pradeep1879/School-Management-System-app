import { useForm } from "react-hook-form";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUpdateSubject } from "../../hooks/useSubjects";


interface Props {
  subject: any;
  setOpen: (val: boolean) => void;
}

export default function EditSubjectDialog({ subject, setOpen }: Props) {
  const { register, handleSubmit } = useForm({
    defaultValues: subject,
  });

  const { mutate, isPending } = useUpdateSubject();

  const onSubmit = (data: any) => {
    mutate(
      { id: subject.id, data },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Subject</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input {...register("name")} />
        <Input {...register("code")} />
        <Input {...register("room")} />
        <Input type="number" {...register("periods")} />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isPending ? "Updating..." : "Update Subject"}
        </Button>
      </form>
    </DialogContent>
  );
}