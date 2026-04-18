import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AddClass from "../../class/components/AddClass";
import ClassCard from "../../class/components/ClassCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useClasses } from "@/features/class/hooks/useClasses";
import { Skeleton } from "@/components/ui/skeleton";
import { useClassDropdown } from "@/features/class/hooks/useClassDropDown";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Classes = () => {
  const [open, setOpen] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState("ALL");
  const navigate = useNavigate();
  const { data: dropdownData } = useClassDropdown();
  const sessions: string[] = Array.from(
    new Set(
      (dropdownData?.classes || []).map(
        (cls: any) => cls.session
      )
    )
  );

  const { data, isLoading, isError } = useClasses(
    1,
    10,
    selectedSession === "ALL"
      ? undefined
      : selectedSession
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            Classes Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor classes, view, update and delete
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Add New Class
            </Button>
          </DialogTrigger>
          <AddClass setOpen={setOpen} />
        </Dialog>
      </div>

      <div className="mt-6 max-w-xs">
        <Select
          value={selectedSession}
          onValueChange={setSelectedSession}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">
              All Sessions
            </SelectItem>
            {sessions.map((session) => (
              <SelectItem
                key={session}
                value={session}
              >
                {session}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        
        {/* Loading Skeleton */}
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}

        {/* Error */}
        {isError && (
          <p className="text-red-500">Failed to load classes</p>
        )}

        {/* Empty State */}
        {!isLoading && data?.classes?.length === 0 && (
          <p className="text-muted-foreground">
            No classes found. Create one!
          </p>
        )}

        {/* Real Data */}
        {data?.classes?.map((cls: any) => (
          <ClassCard
            key={cls.id}
            classId={cls.id}
            className={`Class ${cls.slug}`}
            section={cls.section}
            session={cls.session}
            classTeacher={cls.teacher?.teacherName || "Not Assigned"}
            students={cls._count?.students || 0}
            onView={() =>
              navigate(`/admin/class-detail/${cls.id}`)
            }
            onUpdate={() => console.log("Update", cls.id)}
            onDelete={() => console.log("Delete", cls.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Classes;
