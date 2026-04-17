
import { useNavigate } from "react-router-dom";
import { useExams } from "../hooks/useExam";
import { useAuthStore } from "@/store/auth.store";
import ExamStatusActions from "../components/ExamStatusActions";

interface Props {
  classId: string;
  canEdit: boolean;
}

export default function ExamsSection({ classId }: Props) {
  const { data, isLoading } = useExams(classId);
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);

  if (isLoading) return <p>Loading...</p>;

  const exams = data?.exams || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {exams.map((exam: any) => (
        <div key={exam.id} className="border rounded-xl p-6 bg-card">
          <h3 className="font-semibold">{exam.title}</h3>

          <ExamStatusActions
            examId={exam.id}
            status={exam.status}
            role={role}
          />

          <button
            onClick={() => navigate(`/teacher/exam/${exam.id}`)}
            className="mt-4 text-sm underline"
          >
            Manage Exam
          </button>
        </div>
      ))}
    </div>
  );
}