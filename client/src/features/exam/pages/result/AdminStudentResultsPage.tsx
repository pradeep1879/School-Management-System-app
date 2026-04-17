import ResultsOverviewSection from "@/features/exam/components/ResultsOverviewSection";
import { useParams } from "react-router-dom";


export default function AdminStudentResultsPage() {
  const { examId } = useParams();
  if (!examId) return null;

  return (
    <ResultsOverviewSection
      examId={examId}
      basePath="/admin"
    />
  );
}