import { Skeleton } from "@/components/ui/skeleton";

export default function HomeworkCardSkeleton() {
  return (
    <div className="border rounded-xl p-6 bg-card space-y-4">
      {/* Title */}
      <Skeleton className="h-5 w-3/4" />

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Due Date */}
      <Skeleton className="h-4 w-32" />

      {/* Footer Buttons */}
      <div className="flex justify-between pt-3">
        <Skeleton className="h-8 w-24 rounded-md" />
        <Skeleton className="h-8 w-20 rounded-md" />
      </div>
    </div>
  );
}