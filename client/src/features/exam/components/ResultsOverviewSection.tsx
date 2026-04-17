import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trophy,
  CheckCircle,
  XCircle,
  BarChart3,
  Medal,
} from "lucide-react";

import { useExamResultsOverview } from "../hooks/useResult";

import { StatsCardsSkeleton, TableSkeleton } from "../skeletons/resultOverViewSectionSkeleton";

interface Props {
  examId: string;
  basePath: string;
}

export default function ResultsOverviewSection({
  examId,
  basePath,
}: Props) {
  const navigate = useNavigate();
  const { data, isLoading } = useExamResultsOverview(examId);

if (isLoading) {
  return (
    <div className="space-y-6">
      <StatsCardsSkeleton count={5} />
      <TableSkeleton columns={8} rows={6} />
    </div>
  );
}
if (!data) return <p>No results found</p>;

  return (
    <div className="space-y-6">

      {/* ===================== TOP SUMMARY BAR ===================== */}
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-5 gap-2">

        {/* Topper */}
        <Card className="bg-linear-to-r from-yellow-100 to-orange-100">
          <CardContent className="p-4 flex items-center gap-3">
            <Trophy className="text-yellow-600" />
            <div>
              <p className="text-xs text-muted-foreground">
                Topper
              </p>
              <p className="font-semibold text-black">
                {data.topper?.student?.studentName}
              </p>
              <p className="text-xs text-muted-foreground">
                {data.topper?.percentage}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Average */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BarChart3 className="text-indigo-600" />
            <div>
              <p className="text-xs text-muted-foreground">Average</p>
              <p className="font-semibold text-lg">
                {data.average}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Students */}
        {/* <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Users className="text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">
                Students
              </p>
              <p className="font-semibold text-lg">
                {data.totalStudents}
              </p>
            </div>
          </CardContent>
        </Card> */}

        {/* Pass Count */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600" />
            <div>
              <p className="text-xs text-muted-foreground">
                Passed
              </p>
              <p className="font-semibold text-lg">
                {data.passCount}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Fail Count */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="text-red-600" />
            <div>
              <p className="text-xs text-muted-foreground">
                Failed
              </p>
              <p className="font-semibold text-lg">
                {data.failCount}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pass Percentage */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Medal className="text-purple-600" />
            <div>
              <p className="text-xs text-muted-foreground">
                Pass %
              </p>
              <p className="font-semibold text-lg">
                {data.passPercentage}%
              </p>
            </div>
          </CardContent>
        </Card>

        

      </div>

      {/* ===================== RESULTS TABLE ===================== */}
      <div className="border overflow-x-auto custom-scrollbar rounded-xl overflow-hidden">
        <table className="w-full min-w-127.5 text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Roll</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">%</th>
              <th className="p-3 text-left">Grade</th>
              <th className="p-3 text-left">Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {data.results.map((r: any) => (
              <tr
                key={r.student.id}
                className="border-t hover:bg-muted/30 transition"
              >
                <td className="p-3 font-semibold">
                  #{r.rank}
                </td>
                <td className="p-3">
                  {r.student.rollNumber}
                </td>
                <td className="p-3">
                  {r.student.studentName}
                </td>
                <td className="p-3">
                  {r.totalObtained}/{r.totalMarks}
                </td>
                <td className="p-3">
                  {r.percentage}%
                </td>
                <td className="p-3">
                  <Badge>{r.grade}</Badge>
                </td>
                <td className="p-3">
                  <Badge
                    variant={
                      r.status === "PASS"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {r.status}
                  </Badge>
                </td>
                <td className="p-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(
                        `${basePath}/exam/${examId}/result/${r.student.id}`
                      )
                    }
                  >
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}