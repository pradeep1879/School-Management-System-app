import { useQuery } from "@tanstack/react-query";
import { getExamResultsOverview, getStudentDetailedResult } from "../api/result.api";


export const useExamResultsOverview = (examId: string) => {
  return useQuery({
    queryKey: ["exam-results-overview", examId],
    queryFn: () => getExamResultsOverview(examId),
    placeholderData: (prev) => prev,
    enabled: !!examId,
  });
};


export const useStudentDetailedResult = (
  examId: string,
  studentId: string
) => {
  return useQuery({
    queryKey: ["student-result", examId, studentId],
    queryFn: () =>
      getStudentDetailedResult(examId, studentId),
    enabled: !!examId && !!studentId,
  });
};