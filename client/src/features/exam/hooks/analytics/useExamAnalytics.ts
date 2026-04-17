import { useQuery } from "@tanstack/react-query";
import { getExamAnalytics } from "../../api/analytics.api";


export const useExamAnalytics = (examId: string) => {
  return useQuery({
    queryKey: ["exam-analytics", examId],
    queryFn: () => getExamAnalytics(examId),
    enabled: !!examId,
    placeholderData: (prev) => prev,
  });
};