import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GraduationCap } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import MarkAttendanceDialog from "@/features/attendance/components/MarkAttendanceDialog";

interface Student {
  id: string;
  studentName: string;
  rollNumber: string;
}

interface ClassDetailHeaderProps {
  classId: string;
  students: Student[];
  className: string;
  section: string;
  classTeacher: string;
  totalStudents: number;
  totalSubjects: number;
  attendance: number;
  academicYear: string;
}

const ClassDetailHeader = ({
  classId,
  students,
  className,
  section,
  classTeacher,
  academicYear,
}: ClassDetailHeaderProps) => {
  const role = useAuthStore((state) => state.role);

  return (
    <Card className="relative border border-border/50 bg-linear-to-br from-background to-muted/20 shadow-sm overflow-hidden">
      {/* Subtle Background Accent */}
      <div className="absolute inset-0 bg-primary/5 opacity-20" />

      <CardContent className="relative z-10 p-6 sm:p-8 space-y-6">
        {/* ============ TOP ROW ============ */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          
          {/* Left Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            
            {/* Class Icon */}
            <div className="shrink-0 h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <GraduationCap size={28} />
            </div>

            {/* Class Info */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {className}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge variant="secondary" className="text-sm">
                  Section {section}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {academicYear}
                </Badge>
              </div>

              {/* Teacher Info */}
              <div className="flex items-center gap-2 mt-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {classTeacher
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>

                <p className="text-sm text-muted-foreground">
                  Teacher:{" "}
                  <span className="font-medium text-foreground">
                    {classTeacher}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Action */}
          {role === "teacher" && (
            <div className="shrink-0 mt-3 sm:mt-0">
              <MarkAttendanceDialog classId={classId} students={students} />
            </div>
          )}
        </div>

        {/* ============ STATS ROW ============ */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t">
          <div className="flex items-center gap-3">
            <Users className="text-primary" size={24} />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Total Students
              </p>
              <p className="text-lg sm:text-xl font-semibold">
                {totalStudents}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <BookOpen className="text-primary" size={24} />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Subjects
              </p>
              <p className="text-lg sm:text-xl font-semibold">
                {totalSubjects}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="text-primary" size={24} />
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Attendance
              </p>
              <p className="text-lg sm:text-xl font-semibold">
                {attendance}%
              </p>
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
};

export default ClassDetailHeader;