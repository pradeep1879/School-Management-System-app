import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts";
import { Activity, CalendarClock, Mail, Phone, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeacherProfile } from "@/features/teacher/hooks/useTeacherProfile";
import { useAuthStore } from "@/store/auth.store";
import { useTeacherAttendanceProfile } from "../hooks/useTeacherAttendanceProfile";
import { useMyAttendance } from "../hooks/useMyAttendance";
import {
  ATTENDANCE_STATUS_STYLES,
  buildAttendanceDonutData,
  buildAttendanceTrend,
  calculateAttendanceStreak,
} from "@/features/attendance/utils/attendanceProfile";

const chartConfig = {
  attendanceRate: { label: "Attendance", color: "var(--chart-1)" },
} as const;

const buildTeacherSelfSummary = (records: any[]) => {
  const summary = {
    totalDays: records.length,
    present: 0,
    absent: 0,
    leave: 0,
    halfDay: 0,
    holiday: 0,
    attendancePercentage: "0.00",
  };

  records.forEach((record) => {
    switch (record.status) {
      case "PRESENT":
        summary.present += 1;
        break;
      case "ABSENT":
        summary.absent += 1;
        break;
      case "LEAVE":
        summary.leave += 1;
        break;
      case "HALF_DAY":
        summary.halfDay += 1;
        break;
      case "HOLIDAY":
        summary.holiday += 1;
        break;
    }
  });

  const counted = summary.present + summary.absent + summary.leave + summary.halfDay;
  const attended = summary.present + summary.halfDay * 0.5;

  summary.attendancePercentage = counted
    ? ((attended / counted) * 100).toFixed(2)
    : "0.00";

  return summary;
};

export default function TeacherAttendanceStatsPageFT() {
  const { teacherId } = useParams();
  const role = useAuthStore((state) => state.role);
  const isTeacherSelfView = role === "teacher" && !teacherId;
  const { data: teacherProfile, isLoading: teacherProfileLoading } = useTeacherProfile();
  const { data: myAttendance, isLoading: myAttendanceLoading } = useMyAttendance({
    enabled: isTeacherSelfView,
  });
  const { data, isLoading } = useTeacherAttendanceProfile(teacherId);

  const history = isTeacherSelfView ? myAttendance || [] : data?.history || [];
  const summary = isTeacherSelfView ? buildTeacherSelfSummary(history) : data?.summary;
  const teacher = isTeacherSelfView ? teacherProfile?.teacher : data?.teacher;

  const trendData = useMemo(() => buildAttendanceTrend(history), [history]);
  const donutData = useMemo(() => buildAttendanceDonutData(summary || {}), [summary]);
  const streak = useMemo(() => calculateAttendanceStreak(history), [history]);

  if (isTeacherSelfView ? teacherProfileLoading || myAttendanceLoading : isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    );
  }

  if (!teacher || !summary) {
    return <p className="text-sm text-muted-foreground">Teacher attendance data not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Card className="rounded-3xl border bg-card/80">
        <CardContent className="p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 rounded-3xl ring-1 ring-border/60">
                <AvatarImage src={teacher.imageUrl} />
                <AvatarFallback className="rounded-3xl text-xl font-semibold">
                  {teacher.teacherName?.split(" ").map((word: string) => word[0]).join("")}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">{teacher.teacherName}</h1>
                  <p className="text-sm text-muted-foreground">
                    {isTeacherSelfView
                      ? "Your attendance profile and reliability analytics"
                      : "Attendance profile and reliability analytics"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Teacher Attendance</Badge>
                  <Badge variant="outline">Experience: {teacher.experience || "Not set"}</Badge>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{teacher.contactNo || "Not available"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid min-w-[220px] gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <div className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Attendance Rate</p>
                <p className="mt-2 text-2xl font-semibold">{summary.attendancePercentage}%</p>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Current Streak</p>
                <p className="mt-2 text-2xl font-semibold">{streak} days</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-3xl border bg-card/80">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total Records</p>
            <p className="mt-3 text-3xl font-semibold">{summary.totalDays}</p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-card/80">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Present</p>
              <p className="mt-2 text-3xl font-semibold">{summary.present}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-card/80">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-300">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Half Days</p>
              <p className="mt-2 text-3xl font-semibold">{summary.halfDay}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-card/80">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-300">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Exceptions</p>
              <p className="mt-2 text-3xl font-semibold">{summary.absent + summary.leave + summary.halfDay}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="rounded-3xl border bg-card/80">
          <CardHeader>
            <CardTitle>Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <AreaChart data={trendData} margin={{ left: 12, right: 12, top: 8 }}>
                <defs>
                  <linearGradient id="teacher-attendance-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-attendanceRate)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-attendanceRate)" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="attendanceRate"
                  stroke="var(--color-attendanceRate)"
                  fill="url(#teacher-attendance-fill)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-card/80">
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="h-[240px] w-full">
              <ChartContainer config={{}} className="h-full w-full">
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="label"
                    innerRadius={60}
                    outerRadius={92}
                    paddingAngle={3}
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.key} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
                </PieChart>
              </ChartContainer>
            </div>

            <div className="grid gap-2">
              {donutData.map((entry) => (
                <div key={entry.key} className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-muted-foreground">{entry.label}</span>
                  </div>
                  <span className="text-sm font-semibold">{entry.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-3xl border bg-card/80">
          <CardHeader>
            <CardTitle>Recent Attendance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="custom-div-scroll max-h-[420px] space-y-3 overflow-y-auto pr-1">
              {history.map((record: any) => (
                <div key={record.id} className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                  <div>
                    <p className="font-medium">{format(new Date(record.date), "PPP")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Approval: {record.approvalStatus?.toLowerCase?.() || "pending"}
                    </p>
                  </div>
                  <Badge variant="outline" className={ATTENDANCE_STATUS_STYLES[record.status] || ""}>
                    {record.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-card/80">
          <CardHeader>
            <CardTitle>Operational Signals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
              <p className="font-medium">Reliability Outlook</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {Number(summary.attendancePercentage) >= 90
                  ? "Attendance reliability is strong and consistent."
                  : Number(summary.attendancePercentage) >= 75
                  ? "Attendance is stable, with a few exception days to watch."
                  : "Attendance exceptions are high enough to warrant follow-up."}
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Leaves</span>
                  <span className="font-semibold">{summary.leave}</span>
                </div>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Absences</span>
                  <span className="font-semibold">{summary.absent}</span>
                </div>
              </div>
              <div className="rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Half Days</span>
                  <span className="font-semibold">{summary.halfDay}</span>
                </div>
              </div>
            </div>

            <Progress value={Number(summary.attendancePercentage)} className="h-2" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
