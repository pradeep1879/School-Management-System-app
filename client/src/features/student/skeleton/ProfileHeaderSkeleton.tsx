import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StudentProfileHeaderSkeleton() {
  return (
    <Card className="p-5 w-full sm:p-6">
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

        {/* LEFT SECTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 flex-1">

          {/* Avatar */}
          <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full shrink-0" />

          {/* Info */}
          <div className="space-y-3 flex-1">

            {/* Name */}
            <Skeleton className="h-7 w-48 sm:w-56 lg:w-72" />

            {/* Class / Roll */}
            <Skeleton className="h-4 w-36 sm:w-40 lg:w-52" />

            {/* Badges */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-28 sm:w-32 rounded-full" />
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Skeleton className="h-4 w-36 sm:w-40" />
              <Skeleton className="h-4 w-28 sm:w-32" />
              <Skeleton className="h-4 w-32 sm:w-36" />
            </div>

          </div>
        </div>

        {/* Action Button */}
        <Skeleton className="h-10 w-24 rounded-md self-start xl:self-center" />

      </div>
    </Card>
  )
}