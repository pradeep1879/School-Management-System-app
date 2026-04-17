import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as examApi from "../api/exam.api";
import { toast } from "sonner";

export const useExams = (classId?: string) => {
  return useQuery({
    queryKey: ["exams", classId],
    queryFn: () => examApi.getExams(classId!),
    enabled: !!classId,
  });
};

export const useCreateExam = (classId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: examApi.createExam,
    onSuccess: (res:any) => {
      toast.success(res?.message || "Exam created")
      queryClient.invalidateQueries({
        queryKey: ["exams", classId],
      });
    },
    onError: (error:any) => {
      console.log(error?.response)
      toast.error(error?.response?.data?.message || "Failed to create exam")
    }
  });
};

export const useSubjectResults = (
  examId: string,
  subjectId: string
) => {
  return useQuery({
    queryKey: ["exam-results", examId, subjectId],
    queryFn: () => examApi.getSubjectResults(examId, subjectId),
    enabled: !!examId && !!subjectId,
  });
};

export const useBulkMarksUpdate = (examId: string, subjectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: examApi.bulkUpdateMarks,

    onSuccess: (res:any) => {

      toast.success(res?.message || "Mark updated")
      queryClient.invalidateQueries({
        queryKey: ["exam-results", examId, subjectId],
      });
    },
    onError: (error:any) => {
      console.log(error?.response)
      toast.error(error?.response?.data?.message || "Failed to create exam")
    }
  });
};

export const usePublishExam = (examId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => examApi.publishExam(examId),

    onSuccess: (data) => {
      //  Backend success message
      toast.success(data?.message || "Exam published successfully");

      // Refresh exams list
      queryClient.invalidateQueries({
        queryKey: ["exams"],
      });

      // Also refresh subject results if open
      queryClient.invalidateQueries({
        queryKey: ["exam-results"],
      });
    },

    onError: (error: any) => {
      //  Extract backend error safely
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";

      toast.error(message);
    },
  });
};