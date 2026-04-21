import type { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

const ChartCard = ({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
}: ChartCardProps) => {
  return (
    <Card
      className={cn(
        "rounded-[28px] border-border/60 bg-card/80 shadow-[0_20px_60px_-30px_rgba(79,70,229,0.55)] backdrop-blur transition-all duration-300 hover:scale-[1.02]",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </CardHeader>
      <CardContent className={cn("pt-0", contentClassName)}>{children}</CardContent>
    </Card>
  );
};

export default ChartCard;
