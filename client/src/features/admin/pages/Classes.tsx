import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import AddClass from "../../class/components/AddClass";
import ClassCard from "../../class/components/ClassCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useClasses } from "@/features/class/hooks/useClasses";
import { Skeleton } from "@/components/ui/skeleton";

const Classes = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useClasses(1, 10);

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
            classTeacher={cls.teacher?.teacherName || "Not Assigned"}
            students={cls._count?.student || 0}
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