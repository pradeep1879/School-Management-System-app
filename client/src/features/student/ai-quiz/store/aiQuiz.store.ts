import { create } from "zustand";
import type { AIQuiz } from "../types/aiQuiz.types";

type AIQuizStore = {
  quiz: AIQuiz | null;
  attemptId: string | null;
  startedAt: string | null;
  elapsedSeconds: number;
  currentQuestionIndex: number;
  answers: Record<string, string>;
  setSession: (payload: {
    quiz: AIQuiz;
    attemptId: string;
    startedAt: string;
    answers?: Record<string, string>;
  }) => void;
  selectAnswer: (questionId: string, answer: string) => void;
  setCurrentQuestionIndex: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  syncElapsedFromStart: () => void;
  resetQuizSession: () => void;
};

const initialState = {
  quiz: null,
  attemptId: null,
  startedAt: null,
  elapsedSeconds: 0,
  currentQuestionIndex: 0,
  answers: {},
};

export const useAIQuizStore = create<AIQuizStore>((set) => ({
  ...initialState,

  setSession: ({ quiz, attemptId, startedAt, answers }) =>
    set({
      quiz,
      attemptId,
      startedAt,
      answers: answers ?? {},
      elapsedSeconds: Math.max(
        Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000),
        0,
      ),
      currentQuestionIndex: 0,
    }),

  selectAnswer: (questionId, answer) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [questionId]: answer,
      },
    })),

  setCurrentQuestionIndex: (index) =>
    set((state) => ({
      currentQuestionIndex:
        state.quiz && state.quiz.questions.length > 0
          ? Math.min(Math.max(index, 0), state.quiz.questions.length - 1)
          : 0,
    })),

  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex:
        state.quiz && state.currentQuestionIndex < state.quiz.questions.length - 1
          ? state.currentQuestionIndex + 1
          : state.currentQuestionIndex,
    })),

  previousQuestion: () =>
    set((state) => ({
      currentQuestionIndex:
        state.currentQuestionIndex > 0
          ? state.currentQuestionIndex - 1
          : state.currentQuestionIndex,
    })),

  syncElapsedFromStart: () =>
    set((state) => ({
      elapsedSeconds: state.startedAt
        ? Math.max(
            Math.floor((Date.now() - new Date(state.startedAt).getTime()) / 1000),
            0,
          )
        : 0,
    })),

  resetQuizSession: () => set(initialState),
}));
