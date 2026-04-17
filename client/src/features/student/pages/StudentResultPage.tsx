import { useParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import StudentResultSection from "@/features/exam/components/StudentResultSection";


export default function StudentResultsPage() {
  const { examId } = useParams();
  const studentId = useAuthStore((s) => s.userId);

  if (!examId || !studentId) return null;

  return (
    <StudentResultSection
      examId={examId}
      studentId={studentId}
    />
  );
}