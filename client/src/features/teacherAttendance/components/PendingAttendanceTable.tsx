import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, CheckCheck, Eye, ShieldAlert, XCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AttendanceStatusBadge from "./AttendanceStatusBadge";
import { useApproveAttendance } from "../hooks/useApproveAttendance";
import { usePendingTeacherAttendance } from "../hooks/usePendingTeacherAttendance";
import { useRejectAttendance } from "../hooks/useRejectAttendance";

type PendingAttendanceItem = {
  id: string;
  teacherId: string;
  date: string;
  status: string;
  approvalStatus?: string;
  teacher: {
    teacherName: string;
    email?: string;
  };
};

export default function PendingAttendanceTable() {
  const navigate = useNavigate();
  const { data, isLoading } = usePendingTeacherAttendance();
  const approve = useApproveAttendance();
  const reject = useRejectAttendance();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<"approve" | "reject" | null>(null);

  const records = (data || []) as PendingAttendanceItem[];

  const selectedCount = selectedIds.length;
  const allSelected = records.length > 0 && selectedCount === records.length;
  const someSelected = selectedCount > 0 && selectedCount < records.length;

  const approvingId =
    typeof approve.variables === "string" ? approve.variables : null;
  const rejectingId =
    typeof reject.variables === "object" && reject.variables
      ? reject.variables.attendanceId
      : null;

  const summary = useMemo(
    () => ({
      total: records.length,
      present: records.filter((item) => item.status === "PRESENT").length,
      absent: records.filter((item) => item.status === "ABSENT").length,
    }),
    [records],
  );

  const toggleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? records.map((item) => item.id) : []);
  };

  const toggleSingle = (attendanceId: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked
        ? [...current, attendanceId]
        : current.filter((item) => item !== attendanceId),
    );
  };

  const clearSelectionForIds = (ids: string[]) => {
    setSelectedIds((current) => current.filter((item) => !ids.includes(item)));
  };

  const handleBulkApprove = async () => {
    if (selectedIds.length === 0) return;

    setBulkAction("approve");

    try {
      for (const attendanceId of selectedIds) {
        await approve.mutateAsync(attendanceId);
      }

      clearSelectionForIds(selectedIds);
    } finally {
      setBulkAction(null);
    }
  };

  const handleBulkReject = async () => {
    if (selectedIds.length === 0) return;

    setBulkAction("reject");

    try {
      for (const attendanceId of selectedIds) {
        await reject.mutateAsync({
          attendanceId,
          reason: "Rejected by admin",
        });
      }

      clearSelectionForIds(selectedIds);
    } finally {
      setBulkAction(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-24 w-full rounded-3xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <Skeleton className="h-16 w-full rounded-2xl" />
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <Card className="rounded-3xl border-dashed bg-card/70">
        <CardContent className="flex min-h-56 flex-col items-center justify-center gap-4 p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CheckCheck className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">No attendance requests pending</h3>
            <p className="text-sm text-muted-foreground">
              New teacher attendance submissions will appear here for review.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-3 grid-cols-3">
        <Card className="rounded-3xl bg-card/75">
          <CardContent className="p-4 lg:p-5">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Pending
            </p>
            <p className="mt-2 text-3xl font-semibold">{summary.total}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Attendance requests awaiting review
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-card/75">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Present
            </p>
            <p className="mt-2 text-3xl font-semibold">{summary.present}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Requests marked present by teachers
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl bg-card/75">
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Absent
            </p>
            <p className="mt-2 text-3xl font-semibold">{summary.absent}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Requests marked absent by teachers
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-3xl border bg-card/80 shadow-sm">
        <CardContent className="space-y-4 p-4 sm:p-6">
          <div className="flex flex-col gap-4 rounded-2xl border bg-muted/20 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" />
                <p className="font-semibold">Review queue</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Select one or more requests to approve or reject them together.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl"
                onClick={() => toggleSelectAll(!allSelected)}
              >
                {allSelected ? "Clear selection" : "Select all"}
              </Button>

              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {selectedCount} selected
              </Badge>

              <Button
                type="button"
                className="rounded-2xl"
                disabled={selectedCount === 0 || bulkAction !== null}
                onClick={handleBulkApprove}
              >
                {bulkAction === "approve" ? "Approving selected..." : "Approve selected"}
              </Button>

              <Button
                type="button"
                variant="destructive"
                className="rounded-2xl"
                disabled={selectedCount === 0 || bulkAction !== null}
                onClick={handleBulkReject}
              >
                {bulkAction === "reject" ? "Rejecting selected..." : "Reject selected"}
              </Button>
            </div>
          </div>

          <div className="custom-div-scroll w-full max-w-full overflow-x-auto">
            <div className="min-w-190">
              <Table className="">
            <TableHeader>
              <TableRow className="border-border/60">
                <TableHead className="w-12">
                  <Checkbox
                    checked={allSelected || (someSelected ? "indeterminate" : false)}
                    onCheckedChange={(checked) => toggleSelectAll(checked === true)}
                    aria-label="Select all attendance requests"
                  />
                </TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approval</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {records.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isApproving = approvingId === item.id;
                const isRejecting = rejectingId === item.id;
                const isRowBusy = isApproving || isRejecting || bulkAction !== null;

                return (
                  <TableRow
                    key={item.id}
                    data-state={isSelected ? "selected" : undefined}
                    className="border-border/60"
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => toggleSingle(item.id, checked === true)}
                        aria-label={`Select ${item.teacher.teacherName}`}
                      />
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{item.teacher.teacherName}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.teacher.email ?? "Teacher record"}
                        </p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4" />
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </TableCell>

                    <TableCell>
                      <AttendanceStatusBadge status={item.status} />
                    </TableCell>

                    <TableCell className="capitalize">
                      <Badge variant="outline" className="rounded-full">
                        {item.approvalStatus?.toLowerCase() ?? "pending"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex flex-wrap justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl"
                          onClick={() =>
                            navigate(`/admin/teacher-attendance/${item.teacherId}`)
                          }
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>

                        <Button
                          size="sm"
                          className="rounded-xl"
                          disabled={isRowBusy}
                          onClick={() => approve.mutate(item.id)}
                        >
                          {isApproving ? "Approving..." : "Approve"}
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          className="rounded-xl"
                          disabled={isRowBusy}
                          onClick={() =>
                            reject.mutate({
                              attendanceId: item.id,
                              reason: "Rejected by admin",
                            })
                          }
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          {isRejecting ? "Rejecting..." : "Reject"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
