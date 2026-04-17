import { Skeleton } from "@/components/ui/skeleton";
import ChapterCardSkeleton from "./ChapterCardSkeleton";

export default function SyllabusSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />

      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <ChapterCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}