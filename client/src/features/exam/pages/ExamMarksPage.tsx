import { useParams, useSearchParams } from "react-router-dom";

import MarksTable from "../components/MarksTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useBulkMarksUpdate,
  usePublishExam,
  useSubjectResults,
} from "../hooks/useExam";
import { Loader2 } from "lucide-react";

export default function ExamMarksPage() {
  const { examId } = useParams();
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get("subjectId");

  if (!examId || !subjectId) return null;

  const { data, isLoading } = useSubjectResults(examId, subjectId);
  const bulkMutation = useBulkMarksUpdate(examId, subjectId);
  const publishMutation = usePublishExam(examId);

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  const examSubject = data?.examSubject;
  const examStatus = examSubject?.exam?.status || "SCHEDULED";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">
            {examSubject?.subject?.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            Total Marks: {examSubject?.totalMarks}
          </p>
        </div>

        <Badge>{examStatus}</Badge>
      </div>

      <MarksTable
        examSubject={examSubject}
        examStatus={examStatus}
        onSave={(updates) => bulkMutation.mutate(updates)}
        isSaving={bulkMutation.isPending}
      />

      {/* exam must be Evaluation state before publishing */}
      {examStatus === "EVALUATION" && (
        <Button
          onClick={() => publishMutation.mutate()}
          disabled={publishMutation.isPending}
          className="
            w-full
            gap-2
            bg-linear-to-r
            from-purple-600
            to-indigo-600
            hover:from-purple-700
            hover:to-indigo-700
            text-white
            shadow-md
            hover:shadow-lg
            transition-all
            duration-300
            disabled:opacity-70
            disabled:cursor-not-allowed
          "
        >
          {publishMutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Publishing
            </>
          ) : (
            <>🚀 Publish Results</>
          )}
        </Button>
      )}
    </div>
  );
}
