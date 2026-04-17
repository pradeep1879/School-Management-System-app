import { useStudentAttendance } from "../hooks/useStudentAttendance";
import { useMyAttendance } from "../hooks/useMyAttendance";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

interface Props {
  studentId?: string; // optional now
}

export default function StudentAttendanceCard({
  studentId,
}: Props) {
  // If studentId exists → teacher/admin view
  const {
    data: studentData,
    isLoading: studentLoading,
  } = useStudentAttendance(studentId);
  console.log("student attendance card", studentData)
  // If no studentId → student self view
  const {
    data: myData,
    isLoading: myLoading,
  } = useMyAttendance();

  const data = studentId ? studentData : myData;
  const isLoading = studentId
    ? studentLoading
    : myLoading;

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (!data) return null;

  const { summary, history } = data;

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">
            Attendance Summary
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Badge variant="outline">
              Total: {summary.totalDays}
            </Badge>
            <Badge className="bg-green-500">
              Present: {summary.present}
            </Badge>
            <Badge className="bg-red-500">
              Absent: {summary.absent}
            </Badge>
            <Badge className="bg-yellow-500">
              Late: {summary.late}
            </Badge>
            <Badge className="bg-blue-500">
              Leave: {summary.leave}
            </Badge>
          </div>

          <div className="space-y-2">
            <Progress
              value={Number(summary.attendancePercentage)}
            />
            <p className="text-sm">
              Attendance: {summary.attendancePercentage}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* HISTORY */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            Attendance History
          </h2>

          <div className="custom-scrollbar max-h-80 space-y-2 overflow-y-auto">
            {history.map((record) => (
              <div
                key={record.id}
                className="flex justify-between items-center border p-3 rounded-lg"
              >
                <span>
                  {format(new Date(record?.date), "PPP")}
                </span>

                <Badge
                  className={
                    record.status === "PRESENT"
                      ? "bg-green-500"
                      : record.status === "ABSENT"
                      ? "bg-red-500"
                      : record.status === "LATE"
                      ? "bg-yellow-500"
                      : record.status === "LEAVE"
                      ? "bg-blue-500"
                      : "bg-purple-500"
                  }
                >
                  {record.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
