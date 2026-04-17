import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  generateAIQuiz,
  getAIQuizHistory,
  getAIQuizResult,
  startAIQuiz,
  submitAIQuiz,
} from "../api/aiQuiz.api";

export const useAIQuizHistory = (params?: { page?: number; limit?: number }) =>
  useQuery({
    queryKey: ["ai-quiz-history", params],
    queryFn: () => getAIQuizHistory(params),
  });

export const useAIQuizResult = (quizId?: string) =>
  useQuery({
    queryKey: ["ai-quiz-result", quizId],
    queryFn: () => getAIQuizResult(quizId!),
    enabled: !!quizId,
  });

export const useAIQuizStartSession = (quizId?: string) =>
  useQuery({
    queryKey: ["ai-quiz-start", quizId],
    queryFn: () => startAIQuiz(quizId!),
    enabled: !!quizId,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

export const useGenerateAIQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateAIQuiz,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ai-quiz-history"] });
    },
  });
};

export const useSubmitAIQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      quizId,
      answers,
    }: {
      quizId: string;
      answers: { questionId: string; selectedAnswer: string }[];
    }) => submitAIQuiz(quizId, answers),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["ai-quiz-history"] });
      void queryClient.invalidateQueries({
        queryKey: ["ai-quiz-result", data.result.quizId],
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit AI quiz",
      );
    },
  });
};
