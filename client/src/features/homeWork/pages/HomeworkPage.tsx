import { useState } from "react";
import { Plus } from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { useCurrentClass } from "@/features/class/hooks/useCurrentClass";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useHomework } from "../hooks/useHomeWork";
import CreateHomeworkDialog from "../forms/CreateHomeWorkDialog";
import HomeworkCard from "../components/HomeWorkCard";

import HomeworkSkeletonGrid from "@/skeletons/wraper/HomeworkSkeletonGrid";

export default function HomeworkPage() {
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [open, setOpen] = useState(false);

  const { classId, isLoading: classLoading } = useCurrentClass();
  const { data, isLoading } = useHomework(classId);
  const role = useAuthStore((s) => s.role);
  const homework = data?.homework || [];
  
  if (classLoading) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        Loading class...
      </div>
    );
  }
  
  //  Filtering
  const filteredHomework = homework.filter((hw: any) => {
    const matchesTitle = hw.title.toLowerCase().includes(search.toLowerCase());

    const matchesDate = selectedDate
      ? new Date(hw.dueDate).toISOString().split("T")[0] === selectedDate
      : true;

    return matchesTitle && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Class Homework</h2>
          <p className="text-sm text-muted-foreground">
            Assignments for this class
          </p>
        </div>

        {role === "teacher" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Add Homework
              </Button>
            </DialogTrigger>

            <CreateHomeworkDialog classId={classId!} setOpen={setOpen} />
          </Dialog>
        )}
      </div>

      {/* Search + Date Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search homework..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:w-64"
        />

        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="sm:w-48"
        />
      </div>

      {/* Loading */}
      {isLoading && homework.length === 0 && <HomeworkSkeletonGrid/>}

      {/* Empty */}
      {!isLoading && filteredHomework.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No homework found
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredHomework.map((hw: any) => (
          <HomeworkCard key={hw?.id} hw={hw} role={role} />
        ))}
      </div>
    </div>
  );
}
