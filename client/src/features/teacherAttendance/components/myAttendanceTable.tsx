import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

import { useMyAttendance } from "../hooks/useMyAttendance";
import { useTeacherAttendanceHistoryById } from "../hooks/useTeacherAttendanceHistory";

import AttendanceStatusBadge from "./AttendanceStatusBadge";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface Props {
  teacherId?: string;
}



export default function MyAttendanceTable({ teacherId }: Props) {

  // Teacher view
  const teacherQuery = useMyAttendance({
    enabled: !teacherId,
  });

  // Admin view
  const adminQuery = useTeacherAttendanceHistoryById(teacherId, {
    enabled: !!teacherId,
  });

  const { data, isLoading } = teacherId ? adminQuery : teacherQuery;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const records = data || [];

  return (
    <div className="w-full overflow-x-auto custom-scrollbar">
      <div className="min-w-100">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Approval</TableHead>
            <TableHead>Note</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {records.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No attendance records found
              </TableCell>
            </TableRow>
          )}

          {records.map((item: any) => (
            <TableRow key={item.id}>
              <TableCell>{formatDate(item.date)}</TableCell>

              <TableCell>
                <AttendanceStatusBadge status={item.status} />
              </TableCell>

              <TableCell>
                <span className="text-sm capitalize">
                  {item.approvalStatus.toLowerCase()}
                </span>
              </TableCell>

              <TableCell className="text-muted-foreground">
                {item.note || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}