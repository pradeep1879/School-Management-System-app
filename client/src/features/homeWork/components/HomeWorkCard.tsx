import { Calendar, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  hw: any;
  role?: "teacher" | "student" | "admin" | null;
}

export default function HomeworkCard({ hw, role }: Props) {
  const normalize = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const isOverdue = normalize(new Date(hw.dueDate)) < normalize(new Date());


  return (
    <div className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-lg transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {hw.title}
          </h3>

          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Calendar size={14} />
            Due: {new Date(hw.dueDate).toLocaleDateString("en-GB")}
          </div>
        </div>

        {/* Student Overdue Badge */}
        {role === "student" && isOverdue && (
          <Badge variant="destructive">
            Overdue
          </Badge>
        )}
      </div>

      {/* Subjects */}
      <div className="mt-4 space-y-3">
        {hw.subjects?.map((sub: any, index: number) => (
          <div
            key={index}
            className="border rounded-lg p-3 bg-muted/30"
          >
            <div className="text-sm font-medium">
              {sub.subject?.name}
            </div>

            <div className="text-xs text-muted-foreground mt-1">
              {sub.description}
            </div>
          </div>
        ))}
      </div>

      {/* Teacher/Admin Actions */}
      {(role === "teacher" || role === "admin") && (
        <div className="flex justify-end gap-2 mt-4">
          <Button size="icon" variant="ghost">
            <Pencil size={16} />
          </Button>
          <Button size="icon" variant="ghost">
            <Trash2 size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}