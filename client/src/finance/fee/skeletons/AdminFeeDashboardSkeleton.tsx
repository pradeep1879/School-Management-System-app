import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const AdminFeeDashboardSkeleton = () => {
  return (
    <div className="px-3 space-y-6">

      {/* Title */}
      <Skeleton className="h-8 w-56" />

      {/* Finance Cards */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-7 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Chart 1 */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-[260px] w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Chart 2 */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-[260px] w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Chart 3 */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-[260px] w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Chart 4 */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-[260px] w-full rounded-lg" />
          </CardContent>
        </Card>

      </div>

      {/* Class Collection Table */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Skeleton className="h-5 w-48" />

          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border rounded-lg p-3"
            >
              <Skeleton className="h-4 w-32" />

              <div className="flex gap-6">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Overdue Students */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <Skeleton className="h-5 w-40" />

          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center border rounded-lg p-3"
            >
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>

              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
};

export default AdminFeeDashboardSkeleton;