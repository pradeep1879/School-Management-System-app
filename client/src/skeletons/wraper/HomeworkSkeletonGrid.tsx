import HomeworkCardSkeleton from "../HomeworkCardSkeleton";


export default function HomeworkSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <HomeworkCardSkeleton key={i} />
      ))}
    </div>
  );
}