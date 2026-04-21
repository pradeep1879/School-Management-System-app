import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const EmptyState = ({ icon: Icon, title, description }: EmptyStateProps) => {
  return (
    <Card className="rounded-3xl border-dashed border-border/70 bg-card/70">
      <CardContent className="flex min-h-48 flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="rounded-2xl border border-border/70 bg-background/70 p-3 text-primary shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="font-medium text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
