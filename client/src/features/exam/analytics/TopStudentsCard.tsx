import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Trophy } from "lucide-react";

const rankColors = [
  "bg-yellow-100 text-yellow-700",
  "bg-gray-200 text-gray-700",
  "bg-orange-100 text-orange-700",
];

const TopStudentsCard = ({ students }: any) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Students</CardTitle>
        <Trophy className="text-yellow-500" size={20} />
      </CardHeader>

      <CardContent className="space-y-4">

        {students.map((s: any, index: number) => (
          <div
            key={index}
            className="space-y-2 hover:bg-muted/40 p-2 rounded-lg transition"
          >
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3">

                {/* Rank */}
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold ${
                    rankColors[index] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold">
                  {s.name.charAt(0)}
                </div>

                {/* Name */}
                <span className="text-sm font-medium">
                  {s.name}
                </span>
              </div>

              {/* Percentage */}
              <span className="text-sm font-semibold">
                {s.percentage.toFixed(1)}%
              </span>
            </div>

            {/* Progress */}
            <Progress
              value={s.percentage}
              indicatorClassName={
                index === 0
                  ? "bg-yellow-500"
                  : index === 1
                  ? "bg-gray-400"
                  : index === 2
                  ? "bg-orange-500"
                  : "bg-primary"
              }
            />
          </div>
        ))}

      </CardContent>
    </Card>
  );
};

export default TopStudentsCard;