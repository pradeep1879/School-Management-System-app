import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { useClassDropdown } from "@/features/class/hooks/useClassDropDown";
import { formatCompactClassLabel } from "@/features/class/utils/classLabels";
import { useStudentsByClass } from "@/features/student/hooks/useStudentByClass";
import { useStudentFeeSummary } from "../hooks/useStudentFeeSummary";
import { useClassFeeSummary } from "../hooks/useClassFeeSummary";

import ClassCollectionCard from "../components/ClassCollectionCard";
import StudentFeeDetails from "../components/StudentFeeDetail";
import StudentListCard from "../components/StudentListCard";
import { School2 } from "lucide-react";



const CollectFeePage = () => {
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  const { data, isLoading } = useClassDropdown();
  const selectedClass = data?.classes?.find(
    (cls: any) => cls.id === selectedClassId
  );

  const { data: studentsData, isLoading: studentsLoading } = useStudentsByClass(
    selectedClassId, 1,
    10,
    "",
  );

  const { data: feeData, isLoading: feeLoading } = useStudentFeeSummary(
    selectedStudentId || undefined,
  );

  const { data: classSummary } = useClassFeeSummary(selectedClassId);

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Finance · Collect Fees
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage class payments.
          </p>
        </div>

        <Badge variant="outline" className="w-fit">
          {selectedClass?.session || "Academic Session"}
        </Badge>
      </div>

      <ClassCollectionCard
        totalAmount={classSummary?.totalAmount}
        totalPaid={classSummary?.totalPaid}
        totalDue={classSummary?.totalDue}
        todayCollection={classSummary?.todayCollection}
      />

      <Card className="border bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="space-y-4 p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center gap-2">
            <School2 className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-medium text-muted-foreground">
              Select Class
            </h3>
          </div>

          {/* Select */}
          <Select
            value={selectedClassId}
            onValueChange={(value) => {
              setSelectedClassId(value);
              setSelectedStudentId(null);
            }}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Choose a class to manage fees" />
            </SelectTrigger>

            <SelectContent>
              {isLoading && (
                <SelectItem value="loading" disabled>
                  Loading classes...
                </SelectItem>
              )}

              {data?.classes?.map((cls: any) => (
                <SelectItem key={cls.id} value={cls.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{formatCompactClassLabel(cls)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Helper Text */}
          {selectedClassId && (
            <p className="text-xs text-muted-foreground">
              Students and fee data will load for the selected class.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <StudentListCard
          students={studentsData?.students}
          loading={studentsLoading}
          selectedStudentId={selectedStudentId}
          onSelect={setSelectedStudentId}
        />

        <StudentFeeDetails
          feeData={feeData}
          loading={feeLoading}
          studentId={selectedStudentId}
        />
      </div>
    </div>
  );
};

export default CollectFeePage;
