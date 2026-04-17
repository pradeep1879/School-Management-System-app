import api from "@/api/axios";
import type {
  AIQuizHistoryResponse,
  AIQuizResultResponse,
  AIQuizStartResponse,
  GenerateAIQuizPayload,
} from "../types/aiQuiz.types";

export const generateAIQuiz = async (data: GenerateAIQuizPayload) => {
  const res = await api.post<{ success: boolean; message: string; quiz: AIQuizStartResponse["quiz"] }>(
    "/ai-quiz/generate",
    data,
  );

  return res.data;
};

export const startAIQuiz = async (quizId: string) => {
  const res = await api.post<AIQuizStartResponse>(`/ai-quiz/start/${quizId}`);
  return res.data;
};

export const submitAIQuiz = async (
  quizId: string,
  answers: { questionId: string; selectedAnswer: string }[],
) => {
  const res = await api.post<AIQuizResultResponse>(`/ai-quiz/submit/${quizId}`, {
    answers,
  });

  return res.data;
};

export const getAIQuizResult = async (quizId: string) => {
  const res = await api.get<AIQuizResultResponse>(`/ai-quiz/${quizId}/result`);
  return res.data;
};

export const getAIQuizHistory = async (params?: { page?: number; limit?: number }) => {
  const res = await api.get<AIQuizHistoryResponse>("/ai-quiz/history", {
    params,
  });

  return res.data;
};
