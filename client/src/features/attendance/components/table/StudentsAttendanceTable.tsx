import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Student {
  id: string
  studentName: string
  rollNumber: string
  present: number
  absent: number
  late: number
  leave: number
  attendancePercentage: string
}

interface Props {
  students: Student[]
  onRowClick?: (id: string) => void
  getAttendanceColor: (percentage: number) => string
}

export default function StudentsAttendanceTable({
  students,
  onRowClick,
  getAttendanceColor,
}: Props) {
  return (
    <div className="overflow-x-auto custom-scrollbar rounded-lg border">
      <Table className="min-w-125 w-full text-xs sm:text-sm">

        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Present</TableHead>
            <TableHead>Absent</TableHead>
            <TableHead className="hidden sm:table-cell">Late</TableHead>
            <TableHead className="hidden md:table-cell">Leave</TableHead>
            <TableHead>%</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {students.map((student) => (
            <TableRow
              key={student.id}
              onClick={() => onRowClick?.(student.id)}
              className="cursor-pointer hover:bg-muted/40 transition"
            >

              {/* Student */}
              <TableCell>
                <div>
                  <p className="font-medium">
                    {student.studentName}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Roll: {student.rollNumber}
                  </p>
                </div>
              </TableCell>

              {/* Present */}
              <TableCell>
                <Badge className="bg-green-500 text-white text-xs">
                  {student.present}
                </Badge>
              </TableCell>

              {/* Absent */}
              <TableCell>
                <Badge className="bg-red-500 text-white text-xs">
                  {student.absent}
                </Badge>
              </TableCell>

              {/* Late */}
              <TableCell className="hidden sm:table-cell">
                <Badge className="bg-yellow-500 text-white text-xs">
                  {student.late}
                </Badge>
              </TableCell>

              {/* Leave */}
              <TableCell className="hidden md:table-cell">
                <Badge className="bg-blue-500 text-white text-xs">
                  {student.leave}
                </Badge>
              </TableCell>

              {/* Percentage */}
              <TableCell className="w-32 sm:w-40">
                <div className="space-y-1">
                  <Progress
                    value={Number(student.attendancePercentage)}
                    className="h-2"
                    indicatorClassName={getAttendanceColor(
                      Number(student.attendancePercentage)
                    )}
                  />

                  <p className="text-[10px] sm:text-xs">
                    {student.attendancePercentage}%
                  </p>
                </div>
              </TableCell>

            </TableRow>
          ))}
        </TableBody>

      </Table>
    </div>
  )
}