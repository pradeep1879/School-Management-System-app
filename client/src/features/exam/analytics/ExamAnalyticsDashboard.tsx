import { useState, useEffect } from "react";


import ExamSelector from "./ExamSelector";

import GradeDistributionChart from "./GradeDistributionChart";
import SubjectPerformanceChart from "./SubjectPerformanceChart";
import TopStudentsCard from "./TopStudentsCard";
import { useExams } from "../hooks/useExam";
import { useExamAnalytics } from "../hooks/analytics/useExamAnalytics";
import OverviewCards from "./OverViewCards";
import { ExamDashboardSkeleton } from "../skeletons/ExamDashboardSkeleton";

interface Props {
  classId: string;
}

const ExamAnalyticsDashboard = ({ classId }: Props) => {
  const { data: examsData } = useExams(classId);

  const exams = examsData?.exams || [];

  const [examId, setExamId] = useState<string>();

  useEffect(() => {
    if (exams.length && !examId) {
      setExamId(exams[0].id); // default latest exam
    }
  }, [exams]);

  const { data, isLoading } = useExamAnalytics(examId!);

  const analytics = data;

  if (!examId) return null;

  return (
    <div className="space-y-6">

      {/* Exam Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Exam Analytics</h2>
      
        <ExamSelector
          exams={exams}
          selectedExam={examId}
          onChange={setExamId}
        />
      </div>

      {isLoading && <ExamDashboardSkeleton/>}

      {analytics && (
        <>
          <OverviewCards overview={analytics.overview} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GradeDistributionChart data={analytics.gradeDistribution} />
            <SubjectPerformanceChart data={analytics.subjectPerformance} />
          </div>

          <TopStudentsCard students={analytics.topStudents} />
        </>
      )}
    </div>
  );
};

export default ExamAnalyticsDashboard;