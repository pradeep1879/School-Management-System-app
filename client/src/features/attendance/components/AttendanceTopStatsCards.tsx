import { Card, CardContent } from "@/components/ui/card";
import CountUp from "react-countup";
import type { LucideIcon } from "lucide-react";

interface TopStatsCardsProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  suffix?: string;
}

export function AttendanceTopStatsCards({
  title,
  value,
  icon: Icon,
  color,
  suffix = "",
}: TopStatsCardsProps) {
  return (
    <Card className={`border-l-4 ${color}`}>
      <CardContent className="p-2 sm:p-4 flex items-center gap-2 sm:gap-4">
        <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${color}`} />

        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">{title}</p>

          <p className="text-xl font-semibold">
            <CountUp
              end={value || 0}
              duration={1.5}
              separator=","
              suffix={suffix}
            />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}