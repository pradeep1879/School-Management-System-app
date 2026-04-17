import { useStudentDetailedResult } from "../hooks/useResult";
import ResultSummaryCard from "./ResultSummaryCard";
import SubjectResultTable from "./SubjectResultTable";

interface Props {
  examId: string;
  studentId: string;
}

export default function StudentResultSection({
  examId,
  studentId,
}: Props) {
  const { data, isLoading } =
    useStudentDetailedResult(examId, studentId);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No result found</p>;

  return (
    <div className="space-y-6">
      <ResultSummaryCard result={data} />
      <SubjectResultTable subjects={data.subjects} />
    </div>
  );
}