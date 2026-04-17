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

  const { data: studentsData, isLoading: studentsLoading } = useStudentsByClass(
    selectedClassId, 1,
    10,
    "",
  );

  const { data: feeData, isLoading: feeLoading } = useStudentFeeSummary(
    selectedStudentId || undefined,
  );
  console.log("CollectFeePage", feeData);

  const { data: classSummary } = useClassFeeSummary(selectedClassId);

  return (
    <div className="px-3  space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Finance · Collect Fees
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage class payments.
          </p>
        </div>

        <Badge variant="outline">Academic Session</Badge>
      </div>

      <ClassCollectionCard
        totalAmount={classSummary?.totalAmount}
        totalPaid={classSummary?.totalPaid}
        totalDue={classSummary?.totalDue}
        todayCollection={classSummary?.todayCollection}
      />

      <Card className="border bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="p-6 space-y-4">
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
                    <span>
                      {cls.slug} - {cls.section}
                    </span>
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
