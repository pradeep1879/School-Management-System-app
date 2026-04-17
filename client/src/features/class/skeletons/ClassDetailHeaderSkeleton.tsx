import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ClassDetailHeaderSkeleton() {
  return (
    <Card className="relative border border-border/50 bg-linear-to-br from-background to-muted/20 shadow-sm overflow-hidden">
      
      {/* Background Accent */}
      <div className="absolute inset-0 bg-primary/5 opacity-20" />

      <CardContent className="relative z-10 p-6 sm:p-8 space-y-6">

        {/* TOP ROW */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

          {/* LEFT SECTION */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">

            {/* Icon Skeleton */}
            <Skeleton className="h-16 w-16 rounded-2xl shrink-0" />

            {/* Class Info */}
            <div className="flex flex-col gap-3">

              {/* Class Name */}
              <Skeleton className="h-7 w-40 sm:w-56" />

              {/* Badges */}
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>

              {/* Teacher Row */}
              <div className="flex items-center gap-3 mt-2">

                <Skeleton className="h-8 w-8 rounded-full" />

                <Skeleton className="h-4 w-36 sm:w-44" />

              </div>

            </div>
          </div>

          {/* Right Action Skeleton */}
          <Skeleton className="h-10 w-40 rounded-md sm:self-center" />

        </div>

      </CardContent>
    </Card>
  );
}