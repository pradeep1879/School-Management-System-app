import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useExamResultsOverview } from "@/features/exam/hooks/useResult";


interface Props {
  examId: string;
}

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#facc15",
  "#fb923c",
  "#ef4444",
  "#6b7280",
];

const GradeDistributionChart = ({ examId }: Props) => {
  const { data, isLoading } = useExamResultsOverview(examId);
  console.log("gradeDistributionchard", data)

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const results = data?.results || [];

  // Grade Distribution Calculation
  const gradeMap: Record<string, number> = {
    "A+": 0,
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0,
  };

  results.forEach((r: any) => {
    if (gradeMap[r.grade] !== undefined) {
      gradeMap[r.grade] += 1;
    }
  });

  const chartData = Object.entries(gradeMap).map(([grade, count]) => ({
    name: grade,
    value: count,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GradeDistributionChart;