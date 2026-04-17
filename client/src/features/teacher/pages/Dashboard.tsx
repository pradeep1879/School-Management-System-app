
import { Bell } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useTeacherProfile } from "@/features/teacher/hooks/useTeacherProfile";
import AttendanceActionCard from "@/features/teacherAttendance/components/AttendanceActionCard";

export default function TeacherDashboard() {

  const { data, isLoading } = useTeacherProfile();


  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-60 w-full rounded-xl" />
      </div>
    );
  }

  const teacher = data?.teacher;

  const teacherName = teacher?.teacherName || "Teacher";
  const subjectName = teacher?.subjects?.[0]?.name || "Subject";
  const classInfo = teacher?.classes?.[0]
    ? `Class ${teacher.classes[0].slug}${teacher.classes[0].section}`
    : "No Class Assigned";

  return (
    <div className="space-y-8">

      {/* ================= WELCOME SECTION ================= */}
      <div className="rounded-2xl bg-linear-to-r from-indigo-500 to-purple-600 text-white p-8 shadow-lg">
        <h1 className="text-3xl font-semibold">
          Welcome Back, {teacherName} 👋
        </h1>

        <p className="mt-2 text-white/80">
          Ready to inspire young minds today?
        </p>

        <div className="mt-6 flex items-center gap-4">
          <Badge className="bg-white/20 text-white">
            {subjectName}
          </Badge>

          <Badge className="bg-white/20 text-white">
            {classInfo}
          </Badge>
        </div>
      </div>

      {/* ================= MAIN GRID ================= */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="">
          <AttendanceActionCard/>
        </div>
        {/* ================= RIGHT SIDE ================= */}
        <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">

          {/* Today's Classes */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Classes</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              {teacher?.classes?.length ? (
                teacher.classes.map((cls: any) => (
                  <div key={cls.id} className="flex justify-between">
                    <span>--:--</span>
                    <span>
                      Class {cls.slug}{cls.section}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No classes assigned
                </p>
              )}
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Bell size={14} />
                Staff meeting at 3:30 PM
              </div>
              <div className="flex items-center gap-2">
                <Bell size={14} />
                Submit exam papers by Friday
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>This Month Overview</CardTitle>
            </CardHeader>

            <CardContent className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-muted-foreground text-sm">
                  Total Classes
                </p>
                <p className="text-2xl font-semibold">
                  {teacher?.classes?.length || 0}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">
                  Attendance %
                </p>
                <p className="text-2xl font-semibold text-green-600">
                  96%
                </p>
              </div>

              <div>
                <p className="text-muted-foreground text-sm">
                  Pending Tasks
                </p>
                <p className="text-2xl font-semibold text-red-500">
                  2
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}