import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarDays, GraduationCap, TrendingUp, Users } from "lucide-react";
import { useDashboardAnalytics } from "../hooks/useAdminDashboard";
import { Skeleton } from "@/components/ui/skeleton";

const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

export default function DashboardInsights() {
  const { data, isLoading } = useDashboardAnalytics();

  if (isLoading) {
    return (
      <Card className="py-0">
        <CardHeader>
          <CardTitle>Operations Snapshot</CardTitle>
          <CardDescription>Derived from live attendance and class activity</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pb-6">
          <Skeleton className="h-18 w-full rounded-2xl" />
          <Skeleton className="h-18 w-full rounded-2xl" />
          <Skeleton className="h-18 w-full rounded-2xl" />
          <Skeleton className="h-18 w-full rounded-2xl" />
        </CardContent>
      </Card>
    );
  }

  const studentsToday = data?.todayAttendance?.students;
  const teachersToday = data?.todayAttendance?.teachers;
  const weeklyAttendance = data?.charts?.weeklyAttendance ?? [];

  const studentTotal =
    (studentsToday?.PRESENT ?? 0) +
    (studentsToday?.ABSENT ?? 0) +
    (studentsToday?.LEAVE ?? 0) +
    (studentsToday?.HOLIDAY ?? 0);

  const teacherTotal =
    (teachersToday?.PRESENT ?? 0) +
    (teachersToday?.ABSENT ?? 0) +
    (teachersToday?.LEAVE ?? 0) +
    (teachersToday?.HOLIDAY ?? 0);

  const studentRate = studentTotal ? Math.round(((studentsToday?.PRESENT ?? 0) / studentTotal) * 100) : 0;
  const teacherRate = teacherTotal ? Math.round(((teachersToday?.PRESENT ?? 0) / teacherTotal) * 100) : 0;
  const avgStudents = Math.round(average(weeklyAttendance.map((item) => item.studentsPresent)));
  const avgTeachers = Math.round(average(weeklyAttendance.map((item) => item.teachersPresent)));
  const latestDate = weeklyAttendance.at(-1)?.date;

  const items = [
    {
      title: "Student Attendance",
      value: `${studentRate}%`,
      note: `${studentsToday?.PRESENT ?? 0} present out of ${studentTotal || 0}`,
      icon: GraduationCap,
      tone: "from-violet-500/16 to-violet-500/4",
      progress: studentRate,
      progressClassName: "bg-gradient-to-r from-violet-400 to-violet-500",
      badge: `${avgStudents} avg/day`,
    },
    {
      title: "Teacher Attendance",
      value: `${teacherRate}%`,
      note: `${teachersToday?.PRESENT ?? 0} present out of ${teacherTotal || 0}`,
      icon: Users,
      tone: "from-emerald-500/16 to-emerald-500/4",
      progress: teacherRate,
      progressClassName: "bg-gradient-to-r from-emerald-400 to-emerald-500",
      badge: `${avgTeachers} avg/day`,
    },
    {
      title: "Weekly Rhythm",
      value: `${weeklyAttendance.length} days`,
      note: "Attendance captured in the current weekly window",
      icon: TrendingUp,
      tone: "from-sky-500/16 to-sky-500/4",
      progress: Math.min(weeklyAttendance.length * 14.28, 100),
      progressClassName: "bg-gradient-to-r from-sky-400 to-sky-500",
      badge: weeklyAttendance.length > 0 ? "Live" : "Waiting",
    },
    {
      title: "Latest Sync",
      value: latestDate
        ? new Date(latestDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            timeZone: "Asia/Kolkata",
          })
        : "--",
      note: latestDate ? "Most recent attendance trend point" : "No trend data available yet",
      icon: CalendarDays,
      tone: "from-amber-500/16 to-amber-500/4",
      progress: latestDate ? 100 : 0,
      progressClassName: "bg-gradient-to-r from-amber-400 to-amber-500",
      badge: latestDate ? "Synced" : "Pending",
    },
  ];

  return (
    <Card className="py-0">
      <CardHeader>
        <CardTitle className="text-lg">Operations Snapshot</CardTitle>
        <CardDescription>
          Live ratios and weekly pacing derived from attendance data already in the system.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 pb-6">
        {items.map((item) => (
          <div
            key={item.title}
            className={`rounded-2xl border border-border/60 bg-gradient-to-br ${item.tone} p-4`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-white/10 bg-background/70 p-2.5">
                  <item.icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight">{item.value}</p>
                </div>
              </div>
              <Badge variant="outline" className="border-white/10 bg-background/50 text-xs">
                {item.badge}
              </Badge>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">{item.note}</p>
            <Progress
              value={item.progress}
              className="mt-4 h-1.5 bg-background/70"
              indicatorClassName={item.progressClassName}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
