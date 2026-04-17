import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CheckCircle2, BarChart3, Target } from "lucide-react";
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AIQuizResult } from "../types/aiQuiz.types";

type AIQuizAnalyticsChartsProps = {
  result: AIQuizResult;
};

export const AIQuizAnalyticsCharts = ({ result }: AIQuizAnalyticsChartsProps) => {
  const pieData = [
    { name: "Correct", value: result.analytics.correctCount, fill: "#22c55e" },
    { name: "Incorrect", value: result.analytics.incorrectCount, fill: "#ef4444" },
  ];

  const difficultyData = result.analytics.difficultyDistribution.map((item) => ({
    difficulty: item.difficulty,
    correct: item.correct,
    incorrect: item.incorrect,
  }));

  const topicData = result.analytics.topicPerformance.map((item) => ({
    topic: item.topic,
    percentage: item.percentage,
  }));

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Correct vs Incorrect</CardTitle>
              <CardDescription>
                Quick accuracy snapshot for this attempt
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Correct</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-600">
                {result.analytics.correctCount}
              </p>
            </div>
            <div className="rounded-xl border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground">Incorrect</p>
              <p className="mt-1 text-2xl font-semibold text-red-500">
                {result.analytics.incorrectCount}
              </p>
            </div>
          </div>

          <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={96}
                paddingAngle={4}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Difficulty Breakdown</CardTitle>
              <CardDescription>
                See where the quiz got tougher
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="grid grid-cols-3 gap-3">
            {result.analytics.difficultyDistribution.map((item) => (
              <div key={item.difficulty} className="rounded-xl border bg-muted/20 p-3">
                <p className="text-xs capitalize text-muted-foreground">{item.difficulty}</p>
                <p className="mt-1 text-lg font-semibold">{item.total}</p>
                <p className="text-xs text-muted-foreground">
                  {item.correct} correct
                </p>
              </div>
            ))}
          </div>

          <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={difficultyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
              <XAxis dataKey="difficulty" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="correct" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="incorrect" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Topic Performance</CardTitle>
              <CardDescription>
                Stronger and weaker areas by topic
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-5">
          <div className="space-y-2">
            {result.analytics.topicPerformance.map((item) => (
              <div key={item.topic} className="flex items-center justify-between rounded-xl border bg-muted/20 px-3 py-2 text-sm">
                <span className="text-muted-foreground">{item.topic}</span>
                <span className="font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>

          <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicData} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.2} />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="topic" width={90} />
              <Tooltip />
              <Bar dataKey="percentage" fill="#6366f1" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
