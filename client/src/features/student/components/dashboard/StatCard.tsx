import { memo } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Minus } from "lucide-react";
import { Line, LineChart } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  helper: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  chartData?: Array<{ value: number }>;
  accentClassName?: string;
}

const formatTrend = (value = 0) => {
  if (value > 0) return `+${value}`;
  return `${value}`;
};

const getTrendMeta = (trend = 0) => {
  if (trend > 0) {
    return {
      icon: ArrowUpRight,
      className: "text-emerald-400",
    };
  }

  if (trend < 0) {
    return {
      icon: ArrowDownRight,
      className: "text-rose-400",
    };
  }

  return {
    icon: Minus,
    className: "text-muted-foreground",
  };
};

const StatCard = ({
  title,
  value,
  helper,
  icon: Icon,
  trend = 0,
  trendLabel,
  chartData = [],
  accentClassName,
}: StatCardProps) => {
  const trendMeta = getTrendMeta(trend);
  const TrendIcon = trendMeta.icon;

  return (
    <Card className="rounded-[24px] border-border/60 bg-card/80 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.95)] transition-all duration-300 hover:scale-[1.02] hover:border-primary/30">
      <CardContent className="flex h-full min-h-[220px] flex-col gap-4 p-4 md:min-h-[240px] md:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              {value}
            </p>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span className={cn("inline-flex items-center gap-1 font-medium", trendMeta.className)}>
                <TrendIcon className="h-3.5 w-3.5" />
                {formatTrend(trend)}
              </span>
              <span className="line-clamp-1 text-muted-foreground">{trendLabel || helper}</span>
            </div>
          </div>

          <div
            className={cn(
              "rounded-[20px] border border-white/10 bg-white/5 p-2.5 text-primary shadow-inner md:p-3",
              accentClassName
            )}
          >
            <Icon className="h-4.5 w-4.5 md:h-5 md:w-5" />
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/30 px-3 py-2">
            {chartData.length ? (
              <ChartContainer
                config={{
                  value: {
                    label: title,
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-10 w-full"
              >
                <LineChart data={chartData}>
                  <Line
                    dataKey="value"
                    stroke="var(--color-value)"
                    strokeWidth={2.5}
                    dot={false}
                    type="monotone"
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-10 items-center justify-between text-xs text-muted-foreground">
                <span>{helper}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            )}
          </div>

          <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">{helper}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(StatCard);
