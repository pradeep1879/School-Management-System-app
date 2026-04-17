import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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

import { Loader2 } from "lucide-react";

import { usePaySalary } from "../hooks/usePaySalary";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  salary: any;
}

interface FormValues {
  amount: number;
  method: string;
  referenceNo?: string;
}

export default function SalaryPaymentDialog({
  open,
  setOpen,
  salary,
}: Props) {
  const { mutate, isPending, isSuccess } = usePaySalary();

  const { register, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: {
      amount: salary?.finalSalary || 0,
      method: "",
      referenceNo: "",
    },
  });

  useEffect(() => {
    if (salary) {
      setValue("amount", salary.finalSalary);
    }
  }, [salary, setValue]);

  useEffect(() => {
    if (isSuccess) {
      reset();
      setOpen(false);
    }
  }, [isSuccess, reset, setOpen]);

  const onSubmit = (data: FormValues) => {
    mutate({
      salaryId: salary.id,
      data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Pay Salary</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Amount */}
          <Input
            type="number"
            placeholder="Amount"
            {...register("amount", { required: true })}
          />

          {/* Method */}
          <Select
            onValueChange={(value) => setValue("method", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="BANK_TRANSFER">
                Bank Transfer
              </SelectItem>

              <SelectItem value="CASH">
                Cash
              </SelectItem>

              <SelectItem value="UPI">
                UPI
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Reference No */}
          <Input
            placeholder="Reference Number (optional)"
            {...register("referenceNo")}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending && (
                <Loader2 size={16} className="animate-spin mr-2" />
              )}
              Pay Salary
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}