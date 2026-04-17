import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  students?: any[];
  loading: boolean;
  selectedStudentId: string | null;
  onSelect: (id: string) => void;
}

const StudentListCard = ({
  students,
  loading,
  selectedStudentId,
  onSelect,
}: Props) => {
  return (
    <Card className="custom-scrollbar h-162.5 overflow-y-auto xl:col-span-1">
      <CardHeader>
        <CardTitle>Students</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">

        {!students && !loading&& (
          <div className="flex items-center justify-center h-100 text-sm text-muted-foreground">
            Select a claa to view students.
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-16 rounded-md" />
              </div>
            ))}
          </>
        )}

        {/*  Students List */}
        {!loading &&
          students?.map((student) => (
            <div
              key={student.id}
              className={`flex items-center justify-between p-3 rounded-lg border transition ${
                selectedStudentId === student.id
                  ? "bg-primary/5 border-primary/30"
                  : "hover:bg-muted/40"
              }`}
            >
              <p className="font-medium">
                {student.studentName}({student?.rollNumber})
              </p>

              <Button
                size="sm"
                variant="outline"
                onClick={() => onSelect(student.id)}
              >
                View
              </Button>
            </div>
          ))}

        {/*  Empty State */}
        {!loading && students?.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-6">
            No students found
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentListCard;
