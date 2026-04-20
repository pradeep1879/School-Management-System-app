import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Activity, CalendarCheck2, ShieldAlert, Sparkles } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import StudentProfileHeader from "@/features/student/components/StudentProfileHeader";
import { useStudentProfile } from "@/features/student/hooks/useStudentProfile";
import { useAuthStore } from "@/store/auth.store";
import { useMyAttendance } from "../hooks/useMyAttendance";
import { useStudentAttendance } from "../hooks/useStudentAttendance";
import {
  ATTENDANCE_STATUS_STYLES,
  buildAttendanceDonutData,
  buildAttendanceTrend,
  calculateAttendanceStreak,
} from "../utils/attendanceProfile";

const chartConfig = {
  attendanceRate: { label: "Attendance", color: "var(--chart-1)" },
} as const;

export default function StudentAttendanceProfilePage() {
  const { studentId } = useParams<{ studentId: string }>();
  const role = useAuthStore((state) => state.role);
  const isSelfView = role === "student" && !studentId;
  const { data: studentData, isLoading: studentLoading } = useStudentProfile(studentId);
  const { data: attendanceById, isLoading: attendanceByIdLoading } = useStudentAttendance(studentId);
  const { data: myAttendance, isLoading: myAttendanceLoading } = useMyAttendance(isSelfView);

  const attendanceData = isSelfView ? myAttendance : attendanceById;
  const loading = studentLoading || (isSelfView ? myAttendanceLoading : attendanceByIdLoading);
  const summary = attendanceData?.summary;
  const history = attendanceData?.history || [];
  const trendData = useMemo(() => buildAttendanceTrend(history), [history]);
  const donutData = useMemo(() => buildAttendanceDonutData(summary || {}), [summary]);
  const streak = useMemo(() => calculateAttendanceStreak(history), [history]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-80 w-full rounded-3xl" />
      </div>
    );
  }

  const student = studentData?.student;

  if (!student || !summary) {
    return <p className="text-sm text-muted-foreground">Student attendance data not found.</p>;
  }

  return (
    <div className="space-y-6">
      <StudentProfileHeader student={student} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-3xl border bg-card/80">
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Attendance Rate</p>
            <p className="mt-3 text-3xl font-semibold">{summary.attendancePercentage}%</p>
            <Progress value={Number(summary.attendancePercentage)} className="mt-4 h-2" />
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-card/80">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-300">
              <CalendarCheck2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Present Days</p>
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
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current Streak</p>
              <p className="mt-2 text-3xl font-semibold">{streak} days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-card/80">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-300">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Attention Days</p>
              <p className="mt-2 text-3xl font-semibold">{summary.absent + summary.leave + summary.late}</p>
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
            {trendData.length ? (
              <ChartContainer config={chartConfig} className="h-[280px] w-full">
                <AreaChart data={trendData} margin={{ left: 12, right: 12, top: 8 }}>
                  <defs>
                    <linearGradient id="student-attendance-fill" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#student-attendance-fill)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                No trend data available yet.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border bg-card/80">
          <CardHeader>
            <CardTitle>Attendance Mix</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {donutData.length ? (
              <>
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
              </>
            ) : (
              <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
                No attendance mix available yet.
              </div>
            )}
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
              {history.map((record) => (
                <div key={record.id} className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                  <div>
                    <p className="font-medium">{format(new Date(record.date), "PPP")}</p>
                    <p className="mt-1 text-sm text-muted-foreground">Recorded in daily attendance session</p>
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
            <CardTitle>Performance Signals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border border-border/50 bg-background/50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Attendance Stability</p>
                  <p className="text-sm text-muted-foreground">
                    {Number(summary.attendancePercentage) >= 90
                      ? "Strong consistency across recent sessions."
                      : Number(summary.attendancePercentage) >= 75
                      ? "Attendance is healthy, but there is room to improve."
                      : "Attendance needs closer follow-up to avoid academic drift."}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Total Sessions</span>
                <span className="font-semibold">{summary.totalDays}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Leaves Logged</span>
                <span className="font-semibold">{summary.leave}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-border/50 bg-background/50 px-4 py-3">
                <span className="text-sm text-muted-foreground">Late Arrivals</span>
                <span className="font-semibold">{summary.late}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
