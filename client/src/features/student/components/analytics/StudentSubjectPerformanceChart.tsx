import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

import {
  useStudentExamPerformance,
  useStudentExamSubjects,
} from "../../hooks/analyticsHooks/useStudentPerformanceTrend";
import useIsMobile from "@/screen.detector";

/* ================= TYPES ================= */

interface Props {
  studentId?: string;
}

type ChartData = {
  subject: string;
  marks: number;
  passing: number;
  percentage: number;
  color: string;
};

/* ================= LABEL ================= */

const PercentageLabel = ({
  x,
  y,
  width,
  payload,
}: {
  x?: number;
  y?: number;
  width?: number;
  payload?: ChartData;
}) => {
  if (!x || !y || !width || !payload) return null;

  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill="#6b7280"
      textAnchor="middle"
      fontSize={12}
      fontWeight={500}
    >
      {payload.percentage}%
    </text>
  );
};

/* ================= TOOLTIP ================= */

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white dark:bg-zinc-900 border rounded-lg shadow-md p-3 text-sm">
        <p className="font-semibold mb-1">{label}</p>

        <p className="text-indigo-500">Marks: {data.marks}</p>

        <p className="text-muted-foreground">Percentage: {data.percentage}%</p>

        <p className="text-xs text-muted-foreground">
          Passing Marks: {data.passing}
        </p>
      </div>
    );
  }

  return null;
};

/* ================= COMPONENT ================= */

const StudentSubjectPerformanceChart = ({ studentId }: Props) => {
  const { data, isLoading } = useStudentExamPerformance(studentId);

  const [selectedExam, setSelectedExam] = useState<string | undefined>();

  const isMobile = useIsMobile();

  const barSize = isMobile ? 12 : 32;
  const fontSize = isMobile ? 10 : 16;

  /* SET DEFAULT EXAM */

  useEffect(() => {
    if (data?.defaultExamId) {
      setSelectedExam(data.defaultExamId);
    }
  }, [data]);

  /* SUBJECT DATA */

  const { data: subjectData } = useStudentExamSubjects(studentId, selectedExam);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance</CardTitle>
        </CardHeader>

        <CardContent>
          <Skeleton className="h-80 w-full rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  const subjects = subjectData?.subjects || [];

  /* CHART DATA */

  const chartData: ChartData[] = subjects.map((s: any) => ({
    subject: s.subjectName,
    marks: s.obtainedMarks,
    passing: s.passingMarks,
    percentage: s.totalMarks
      ? Math.round((s.obtainedMarks / s.totalMarks) * 100)
      : 0,
    color: s.status === "FAIL" ? "#ef4444" : "#6366f1",
  }));

  return (
    <Card className="shadow-sm border-muted/40">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-semibold">
          Subject Performance
        </CardTitle>

        {/* EXAM DROPDOWN */}

        <Select value={selectedExam} onValueChange={setSelectedExam}>
          <SelectTrigger className="w-44 h-8 text-xs">
            <SelectValue placeholder="Select Exam" />
          </SelectTrigger>

          <SelectContent>
            {data?.exams?.map((exam: any) => (
              <SelectItem key={exam.id} value={exam.id}>
                {exam.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            barGap={4}
            data={chartData}
          >
            {/* GRID */}

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              strokeOpacity={0.15}
            />

            {/* X AXIS */}

            <XAxis
              dataKey="subject"
              interval={0} // force show all labels
              angle={-35} // rotate labels to prevent overlap
              textAnchor="end"
              height={40}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: fontSize }}
            />


            {/* Y AXIS */}
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: fontSize }} />

            {/* TOOLTIP */}

            <Tooltip content={<CustomTooltip />} />

            {/* BARS */}

            <Bar
              dataKey="marks"
              radius={[6, 6, 0, 0]}
              label={<PercentageLabel />}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StudentSubjectPerformanceChart;
