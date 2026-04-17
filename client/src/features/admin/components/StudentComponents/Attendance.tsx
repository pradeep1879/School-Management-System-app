import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const attendanceData = [
  { date: "01 Mar 2026", day: "Monday", status: "Present" },
  { date: "02 Mar 2026", day: "Tuesday", status: "Absent" },
  { date: "03 Mar 2026", day: "Wednesday", status: "Holiday" },
  { date: "04 Mar 2026", day: "Thursday", status: "Leave" },
  { date: "05 Mar 2026", day: "Friday", status: "Present" },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Present":
      return (
        <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">
          Present
        </Badge>
      )
    case "Absent":
      return (
        <Badge className="bg-red-500/10 text-red-600 dark:text-red-400">
          Absent
        </Badge>
      )
    case "Holiday":
      return (
        <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400">
          Holiday
        </Badge>
      )
    case "Leave":
      return (
        <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
          Leave
        </Badge>
      )
    default:
      return <Badge>{status}</Badge>
  }
}

export default function StudentAttendanceTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Attendance</CardTitle>
      </CardHeader>

      <CardContent className="custom-scrollbar overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Day</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {attendanceData.map((item, index) => (
              <TableRow
                key={index}
                className="hover:bg-muted/40 transition"
              >
                <TableCell className="font-medium">
                  {item.date}
                </TableCell>
                <TableCell>{item.day}</TableCell>
                <TableCell>
                  {getStatusBadge(item.status)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
