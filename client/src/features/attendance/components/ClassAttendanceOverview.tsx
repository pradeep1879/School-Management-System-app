import { useState, useMemo } from "react";
import { useClassAttendanceSummary } from "../hooks/useClassAttendanceSummary";
import { Input } from "@/components/ui/input";

import { BarChart3, CalendarDays, Search, Users } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import StudentAttendanceCard from "./StudentAttendanceCard";
import { AttendanceTopStatsCards } from "./AttendanceTopStatsCards";
import StudentsAttendanceTable from "./table/StudentsAttendanceTable";
import { ClassAttendanceOverviewSkeleton } from "../skeletons/ClassAttendanceOverviewSkeleton";


interface Props {
  classId: string;
}

const getAttendanceColor = (percent: number ) => {
  if (percent >= 90) return "bg-green-500";
  if (percent >= 70) return "bg-orange-500";
  return "bg-red-500";
};

export default function ClassAttendanceOverview({
  classId,
}: Props) {
  const { data, isLoading } =
    useClassAttendanceSummary(classId);

  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string | null>("");

  const filteredStudents = useMemo(() => {
    if (!data?.students) return [];
    return data.students.filter((s) =>
      s.studentName
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, data]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ClassAttendanceOverviewSkeleton/>
      </div>
    );
  }

  if (!data) return null;

  const { classSummary, } = data;
  console.log("clasSummary", classSummary);

  return (
    <div className="space-y-6">

    {/* ================= SUMMARY CARDS ================= */}
    <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AttendanceTopStatsCards
        title="Total Students"
        value={classSummary.totalStudents}
        icon={Users}
        color="border-blue-500 text-blue-500"
      />

      <AttendanceTopStatsCards
        title="Total Sessions"
        value={classSummary.totalSessions}
        icon={CalendarDays}
        color="border-purple-500 text-purple-500"
      />

      <AttendanceTopStatsCards
        title="Average Attendance"
        value={Number(classSummary.averageAttendance)}
        icon={BarChart3}
        color="border-green-500 text-green-500"
        suffix="%"
      />
    </div>

    {/* ================= SEARCH ================= */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search student..."
          className="pl-8"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

    {/* ================= TABLE ================= */}
      <StudentsAttendanceTable
        students={filteredStudents}
        getAttendanceColor={getAttendanceColor}
        onRowClick={(id) => setSelectedStudent(id)}
      />

    {selectedStudent && (
      <Dialog
        open={!!selectedStudent}
        onOpenChange={() => setSelectedStudent(null)}
      >
        <DialogContent className="max-w-3xl">
          <StudentAttendanceCard
            studentId={selectedStudent}
          />
        </DialogContent>
      </Dialog>
  )}
  </div>
);

}