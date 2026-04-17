import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";



interface StatsCardsSkeletonProps {
  count?: number;
}

export function StatsCardsSkeleton({ count = 5 }: StatsCardsSkeletonProps) {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 flex items-center gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />

            <div className="space-y-2 w-full">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}



interface TableSkeletonProps {
  columns?: number;
  rows?: number;
}

export function TableSkeleton({ columns = 8, rows = 6 }: TableSkeletonProps) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-3 text-left">
                <Skeleton className="h-4 w-16" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="p-3">
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



interface PageSkeletonProps {
  cardCount?: number;
  columns?: number;
  rows?: number;
}

export function PageSkeleton({
  cardCount = 5,
  columns = 8,
  rows = 6,
}: PageSkeletonProps) {
  return (
    <div className="space-y-6">
      <StatsCardsSkeleton count={cardCount} />
      <TableSkeleton columns={columns} rows={rows} />
    </div>
  );
}