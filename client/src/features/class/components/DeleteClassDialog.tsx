import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteClassDialogProps {
  className: string;
  onConfirm: () => void;
  isLoading?: boolean;
  setOpen: (open: boolean) => void;
}

const DeleteClassDialog = ({
  className,
  onConfirm,
  isLoading,
  setOpen,
}: DeleteClassDialogProps) => {
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={20} />
          </div>

          <DialogTitle className="text-lg font-semibold">
            Delete Class
          </DialogTitle>
        </div>

        <DialogDescription className="mt-3 text-sm text-muted-foreground">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-foreground">
            {className}
          </span>
          ?
          <br />
          <span className="text-red-500 font-medium">
            This action cannot be undone.
          </span>
        </DialogDescription>
      </DialogHeader>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <Button
          variant="outline"
          onClick={() => setOpen(false)}
          disabled={isLoading}
        >
          Cancel
        </Button>

        <Button
          variant="destructive"
          onClick={onConfirm}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
          {isLoading ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </DialogContent>
  );
};

export default DeleteClassDialog;