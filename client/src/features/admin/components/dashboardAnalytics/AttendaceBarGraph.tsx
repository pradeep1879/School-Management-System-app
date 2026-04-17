import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type TooltipProps,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardAnalytics } from "../../hooks/useAdminDashboard";
import useIsMobile from "@/screen.detector";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;

  const students = payload.find((p) => p.dataKey === "students")?.value;
  const teachers = payload.find((p) => p.dataKey === "teachers")?.value;

  return (
    <div className="bg-white dark:bg-zinc-900 border rounded-lg shadow-md px-3 py-2 text-xs">
      <p className="font-semibold mb-1">{label}</p>

      <div className="space-y-1">
        <p className="flex items-center gap-2 text-indigo-500">
          <span className="h-2 w-2 rounded-full bg-indigo-500" />
          Students: {students}
        </p>

        <p className="flex items-center gap-2 text-green-500">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Teachers: {teachers}
        </p>
      </div>
    </div>
  );
};

/* ---------- MAIN COMPONENT ---------- */

const DailyAttendanceChart = () => {
  const { data, isLoading } = useDashboardAnalytics();

  const isMobile = useIsMobile();

  const barSize = isMobile ? 12 : 32;
  const fontSize = isMobile ? 10 : 16;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance Overview</CardTitle>
        </CardHeader>

        <CardContent>
          <Skeleton className="h-80 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const chartData =
    data?.charts?.weeklyAttendance?.map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-IN", {
        weekday: "short",
        timeZone: "Asia/Kolkata",
      }),
      students: d.studentsPresent,
      teachers: d.teachersPresent,
    })) || [];

  return (
    <Card className="shadow-sm border-muted/40">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Daily Attendance Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            barSize={barSize}
            margin={{
              top: 10,
              right: isMobile ? 1 : 20,
              left: isMobile ? -45 : 0,
              bottom: 0,
            }}
            data={chartData}
            barGap={4}
          >
            {/* Gradient Colors */}
            <defs>
              <linearGradient id="studentBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.5} />
              </linearGradient>

              <linearGradient id="teacherBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.5} />
              </linearGradient>
            </defs>

            {/* Axes */}
            <XAxis
              interval={0} // force show all labels
              angle={-35} // rotate labels to prevent overlap
              textAnchor="end"
              height={40}
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: fontSize }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: fontSize }}
              domain={[0, "dataMax + 5"]}
            />

            {/* Tooltip */}
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />

            {/* Legend */}
            <Legend wrapperStyle={{ fontSize: "12px" }} />

            {/* Bars */}
            <Bar
              dataKey="students"
              fill="url(#studentBar)"
              radius={[6, 6, 0, 0]}
              name="Students"
              barSize={barSize}
              animationDuration={600}
            />

            <Bar
              dataKey="teachers"
              fill="url(#teacherBar)"
              radius={[6, 6, 0, 0]}
              name="Teachers"
              barSize={barSize}
              animationDuration={600}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DailyAttendanceChart;
