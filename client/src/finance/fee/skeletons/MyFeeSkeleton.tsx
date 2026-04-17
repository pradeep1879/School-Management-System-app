import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MyFeeSkeleton = () => {
  return (
    <div className="px-3 space-y-6">
      
      {/* Title */}
      <Skeleton className="h-10 w-34" />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        
        {/* Card 1 */}
        <Card className="p-4 text-center">
          <Skeleton className="h-4 w-20 mx-auto mb-3" />
          <Skeleton className="h-6 w-24 mx-auto" />
        </Card>

        {/* Card 2 */}
        <Card className="p-4 text-center">
          <Skeleton className="h-4 w-20 mx-auto mb-3" />
          <Skeleton className="h-6 w-24 mx-auto" />
        </Card>

        {/* Card 3 */}
        <Card className="p-4 text-center">
          <Skeleton className="h-4 w-20 mx-auto mb-3" />
          <Skeleton className="h-6 w-24 mx-auto" />
        </Card>

      </div>

      {/* Installment Table Skeleton */}
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-35 mx-4" />
                  <Skeleton className="h-2  w-25 mx-4" />
                  <Skeleton className="h-2 w-25 mx-4" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                  <Skeleton className="h-3 w-10 mx-4" />
                  <Skeleton className="h-3 w-15 mx-4" />
                  </div>
                  <div className="">
                  <Skeleton className="h-6 w-18 mx-4" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>


      {/* Payment History Table Skeleton */}
      <div className="space-y-3">
          {[...Array(1)].map((_, i) => (
            <Card key={i}>
            <div className="space-y-10">
            <div className="">
              <Skeleton className="h-5 w-30 mx-8" />
            </div>
              <div className="flex items-center justify-between">
                  <Skeleton className="h-2  w-25 mx-9" />
                  <Skeleton className="h-2  w-35 mx-9" />
                  <Skeleton className="h-3  w-10 mx-9" />
                  <Skeleton className="h-2 w-20 mx-9" />
              </div>
              </div>
            </Card>
          ))}
        </div>
    </div>
  );
};

export default MyFeeSkeleton;