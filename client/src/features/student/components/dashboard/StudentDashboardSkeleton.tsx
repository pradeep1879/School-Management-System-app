import { Skeleton } from "@/components/ui/skeleton";

const StudentDashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-72 w-full rounded-[32px]" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-48 w-full rounded-[28px]" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-96 w-full rounded-[28px]" />
        <Skeleton className="h-96 w-full rounded-[28px]" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Skeleton className="h-72 w-full rounded-[28px]" />
        <Skeleton className="h-72 w-full rounded-[28px]" />
      </div>
    </div>
  );
};

export default StudentDashboardSkeleton;
