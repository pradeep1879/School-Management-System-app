import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useTeacherSalaries } from "../hooks/useTeacherSalaries";
import SalaryStatusBadge from "./SalaryStatusBadge";
import SalaryPaymentDialog from "./SalaryPaymentDialog";

function formatCurrency(amount: number) {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export default function SalaryTable() {
  const { data, isLoading } = useTeacherSalaries();
  console.log("salary table", data)

  const [selectedSalary, setSelectedSalary] = useState<any>(null);
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const salaries = data || [];

  return (
    <div className="border rounded-xl">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teacher</TableHead>
            <TableHead>Present</TableHead>
            <TableHead>Absent</TableHead>
            <TableHead>Deduction</TableHead>
            <TableHead>Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {salaries.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
                No salary records found
              </TableCell>
            </TableRow>
          )}

          {salaries.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {item.teacher?.teacherName}
              </TableCell>

              <TableCell>{item.presentDays}</TableCell>

              <TableCell>{item.absentDays}</TableCell>

              <TableCell>
                {formatCurrency(item.deduction)}
              </TableCell>

              <TableCell className="font-semibold">
                {formatCurrency(item.finalSalary)}
              </TableCell>

              <TableCell>
                <SalaryStatusBadge status={item.status} />
              </TableCell>

              <TableCell className="text-right">
                {item.status !== "PAID" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedSalary(item);
                      setOpen(true);
                    }}
                  >
                    Pay
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <SalaryPaymentDialog
        open={open}
        setOpen={setOpen}
        salary={selectedSalary}
      />
    </div>
  );
}