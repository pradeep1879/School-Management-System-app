import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

import PublishConfirmDialog from "./PublishConfirmDialog";
import { usePublishExam } from "../hooks/useExam";
import { useUpdateExamStatus } from "../hooks/useExamStatus";


type ExamStatus =
  | "SCHEDULED"
  | "ONGOING"
  | "EVALUATION"
  | "PUBLISHED"
  | "CANCELLED";

type Props = {
  examId: string;
  status: ExamStatus;
  role: string | null;
};

export default function ExamStatusActions({
  examId,
  status,
  role,
}: Props) {
  const [open, setOpen] = useState(false);

  const updateMutation = useUpdateExamStatus();
  const publishMutation = usePublishExam(examId);

  const isPublished = status === "PUBLISHED";
  const isCancelled =  status === "CANCELLED";
  const isUpdating = updateMutation.isPending;
  const isPublishing = publishMutation.isPending;

  //  Students cannot edit
  if (role === "student") return null;

  //  Prevent changing status after publish
  const isStatusLocked = isPublished;

  const handleStatusChange = (value: ExamStatus) => {
    if (value === status) return;

    updateMutation.mutate({
      examId,
      status: value,
    });
  };

  const handlePublish = () => {
    publishMutation.mutate();
      setOpen(false);
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* ================= STATUS DROPDOWN ================= */}
      <Select
        value={status}
        onValueChange={handleStatusChange}
        disabled={isStatusLocked || isUpdating || isCancelled}
      >
        <SelectTrigger className="w-44">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="SCHEDULED">Scheduled</SelectItem>
          <SelectItem value="ONGOING">Ongoing</SelectItem>
          <SelectItem value="EVALUATION">Evaluation</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {/* ================= STATUS LOADER ================= */}
      {isUpdating && (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      )}

      {/* ================= PUBLISH BUTTON ================= */}
      {status === "EVALUATION" && !isPublished && (
        <Dialog open={open} onOpenChange={setOpen}>
          <Button
            onClick={() => setOpen(true)}
            disabled={isPublishing}
            className="
              bg-linear-to-r
              from-purple-600
              to-indigo-600
              hover:from-purple-700
              hover:to-indigo-700
              text-white
              shadow-md
            "
          >
            {isPublishing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing
              </span>
            ) : (
              "🚀 Publish"
            )}
          </Button>

          <PublishConfirmDialog
            onConfirm={handlePublish}
            onClose={() => setOpen(false)}
            isLoading={isPublishing}
          />
        </Dialog>
      )}

      {/* ================= PUBLISHED LABEL ================= */}
      {(isPublished && !isCancelled) && (
        <span className="text-sm font-medium text-blue-600">
          Published ✔
        </span>
      )}
    </div>
  );
}