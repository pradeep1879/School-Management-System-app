import { Badge } from "@/components/ui/badge";

export default function ResultSummaryCard({ result }: any) {
  const {
    totalObtained,
    totalMarks,
    percentage,
    grade,
    rank,
    status,
    exam,
  } = result;

  const statusColor =
    status === "PASS"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="border rounded-xl p-6 bg-card shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        {exam.title} Result Summary
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <p className="text-muted-foreground">Total Marks</p>
          <p className="font-semibold">
            {totalObtained} / {totalMarks}
          </p>
        </div>

        <div>
          <p className="text-muted-foreground">Percentage</p>
          <p className="font-semibold">{percentage}%</p>
        </div>

        <div>
          <p className="text-muted-foreground">Rank</p>
          <p className="font-semibold">#{rank}</p>
        </div>

        <div>
          <p className="text-muted-foreground">Grade</p>
          <p className="font-semibold">{grade}</p>
        </div>
      </div>

      <div className="mt-6">
        <Badge className={`${statusColor} px-4 py-1`}>
          {status}
        </Badge>
      </div>
    </div>
  );
}