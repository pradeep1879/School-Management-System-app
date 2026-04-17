import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function PublishConfirmDialog({
  onConfirm,
  onClose,
  isLoading,
}: {
  onConfirm: () => void;
  onClose: () => void;
  isLoading: boolean;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Publish Exam?</DialogTitle>
        <DialogDescription>
          Once published, exam results cannot be modified.
        </DialogDescription>
      </DialogHeader>

      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>

        <Button
          onClick={onConfirm}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isLoading ? "Publishing" : "Publish"}
        </Button>
      </div>
    </DialogContent>
  );
}