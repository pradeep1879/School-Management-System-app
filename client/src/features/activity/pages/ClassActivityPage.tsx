import { Plus, Search, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";
import { useActivities, useUpdateActivityStatus } from "../hooks/useActivity";
import { useDebounce } from "@/features/student/hooks/useDebounce";
import AddActivityDialog from "../components/AddActivityDialog";

interface Props {
  classId: string;
  canEdit: boolean;
}

export default function ActivitiesSection({ classId, canEdit }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useActivities(classId);
  const updateStatusMutation = useUpdateActivityStatus();

  const activities = data?.activities || [];

  const filteredActivities = activities.filter((activity: any) =>
    activity.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Class Activities</h2>
          <p className="text-sm text-muted-foreground">
            Activities for this class
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search activity..."
              className="pl-9"
            />
          </div>

          {canEdit && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  Add Activity
                </Button>
              </DialogTrigger>
              <AddActivityDialog classId={classId} setOpen={setOpen} />
            </Dialog>
          )}
          
        </div>
      </div>

      {/* ================= EMPTY ================= */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="border border-border/50 rounded-xl p-6 bg-card space-y-4"
            >
              {/* Title */}
              <Skeleton className="h-5 w-3/4" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* Date + Teacher */}
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= GRID ================= */}
      {!isLoading && filteredActivities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredActivities.map((activity: any) => (
            <div
              key={activity.id}
              className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-lg transition-all duration-300 group"
            >
              <h3 className="text-lg font-semibold">{activity.title}</h3>

              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {activity.description || "No description"}
              </p>

              <div className="mt-5 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={14} />
                  {new Date(activity.startDate).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <User size={14} />
                  {activity.teacher?.teacherName || "Admin"}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <Badge className="text-xs px-3 py-1 rounded-full">
                  {activity.status}
                </Badge>

                {canEdit && (
                  <Select
                    value={activity.status}
                    disabled={
                      activity.status === "COMPLETED" ||
                      updateStatusMutation.isPending
                    }
                    onValueChange={(value) =>
                      updateStatusMutation.mutate({
                        activityId: activity.id,
                        status: value as any,
                        classId,
                      })
                    }
                  >
                    <SelectTrigger className="w-28 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                      <SelectItem value="PENDING">PENDING</SelectItem>
                      <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                      <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
