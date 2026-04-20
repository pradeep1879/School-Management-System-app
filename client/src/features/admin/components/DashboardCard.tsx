import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import CountUp from "react-countup";

interface Props {
  title: string;
  value?: number;
  icon: LucideIcon;
  color: string;
  accentClassName?: string;
  present?: number;
  absent?: number;
  leave?: number;
  holiday?: number;
}

const legendStyles = {
  present: "bg-emerald-400",
  absent: "bg-rose-400",
  leave: "bg-amber-400",
  holiday: "bg-sky-400",
};

const DashboardTopCard = ({
  title,
  value,
  icon: Icon,
  color,
  accentClassName,
  present = 0,
  absent = 0,
  leave = 0,
  holiday = 0,
}: Props) => {
  const total = present + absent + leave + holiday;
  const presentPercent = total ? (present / total) * 100 : 0;
  const absentPercent = total ? (absent / total) * 100 : 0;
  const leavePercent = total ? (leave / total) * 100 : 0;
  const holidayPercent = total ? (holiday / total) * 100 : 0;

  const metrics = [
    { label: "Present", value: present, color: legendStyles.present },
    { label: "Absent", value: absent, color: legendStyles.absent },
    { label: "Leave", value: leave, color: legendStyles.leave },
    { label: "Holiday", value: holiday, color: legendStyles.holiday },
  ].filter((item) => item.value > 0 || total > 0);

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border/60 bg-card/95 py-0 shadow-sm transition-transform duration-300 hover:-translate-y-0.5",
        accentClassName,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.07),transparent_38%)]" />
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
                <CountUp end={value || 0} duration={1.2} separator="," />
              </p>
              {total > 0 && (
                <span className="pb-1 text-xs text-muted-foreground">
                  today snapshot
                </span>
              )}
            </div>
          </div>

          <div className={cn("rounded-2xl border border-white/10 bg-white/5 p-3", color)}>
            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
        </div>

        {total > 0 && (
          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Attendance captured</span>
                <span>{Math.round(presentPercent)}% present</span>
              </div>

              <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary/70">
                <div className="bg-emerald-400" style={{ width: `${presentPercent}%` }} />
                <div className="bg-rose-400" style={{ width: `${absentPercent}%` }} />
                <div className="bg-amber-400" style={{ width: `${leavePercent}%` }} />
                <div className="bg-sky-400" style={{ width: `${holidayPercent}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              {metrics.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border/60 bg-background/40 px-3 py-2"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className={cn("h-2 w-2 rounded-full", item.color)} />
                    {item.label}
                  </div>
                  <p className="mt-1 text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>

            <Progress
              value={presentPercent}
              className="h-1.5 bg-secondary/60"
              indicatorClassName="bg-gradient-to-r from-emerald-400 to-emerald-500"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardTopCard;
