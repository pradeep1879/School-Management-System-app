import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function ClassAttendanceOverviewSkeleton() {
  return (
    <div className="space-y-6">

      {/* ================= TOP STATS ================= */}
      <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="border shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-14" />
              </div>

              <Skeleton className="h-10 w-10 rounded-xl" />

            </CardContent>
          </Card>
        ))}
      </div>

      {/* ================= SEARCH ================= */}
      <Skeleton className="h-10 w-full sm:w-64 rounded-md" />

      {/* ================= TABLE ================= */}
      <div className="border rounded-lg overflow-hidden">

        {/* table header */}
        <div className="bg-muted p-3 grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-20" />
          ))}
        </div>

        {/* rows */}
        <div className="divide-y">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="p-3 grid grid-cols-6 items-center gap-4"
            >
              <div className="space-y-1">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>

              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-6 w-12 rounded-full hidden sm:block" />
              <Skeleton className="h-6 w-12 rounded-full hidden md:block" />

              <div className="space-y-2">
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-10" />
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}