import { useNavigate } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const getAttendanceColor = (percent: number) => {
  if (percent >= 90) return "bg-green-500";
  if (percent >= 70) return "bg-orange-500";
  return "bg-red-500";
};

import { useTeacherAttendanceStats } from "../hooks/useTeacherAttendanceStats";

export default function TeacherAttendanceHistoryStatsTable() {
  const { data, isLoading } = useTeacherAttendanceStats();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  const records = data || [];

  return (
    <div className="custom-scrollbar w-full max-w-full overflow-x-auto">
      <div className="min-w-[720px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Teacher</TableHead>
            <TableHead>Attendance</TableHead>
            <TableHead>Present</TableHead>
            <TableHead>Absent</TableHead>
            <TableHead>Leave</TableHead>
            <TableHead>Half Day</TableHead>
            <TableHead className="text-right">View</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {records.map((item: any) => (
            <TableRow key={item.teacherId}>
              
              {/* Teacher Name */}
              <TableCell className="font-medium">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                    {item.teacherName?.charAt(0)}
                  </div>
                  <span className="truncate">{item.teacherName}</span>
                </div>
              </TableCell>

               {/* Attendance Percent */}
              <TableCell className="min-w-35">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">
                    {item.attendancePercent}%
                  </span>
                  <Progress value={item.attendancePercent} 
                    indicatorClassName={getAttendanceColor(item.attendancePercent)}/>
                </div>
              </TableCell>

              {/* Present */}
              <TableCell>
                <Badge className="bg-green-100 text-green-700">
                  {item.present}
                </Badge>
              </TableCell>

              {/* Absent */}
              <TableCell>
                <Badge className="bg-red-100 text-red-700">
                  {item.absent}
                </Badge>
              </TableCell>

              {/* Leave */}
              <TableCell>
                <Badge className="bg-yellow-100 text-yellow-700">
                  {item.leave}
                </Badge>
              </TableCell>

              {/* Half Day */}
              <TableCell>
                <Badge className="bg-blue-100 text-blue-700">
                  {item.halfDay}
                </Badge>
              </TableCell>


              {/* View Button */}
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigate(`/admin/teacher/attendance/${item.teacherId}`)
                  }
                >
                  View
                </Button>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}
