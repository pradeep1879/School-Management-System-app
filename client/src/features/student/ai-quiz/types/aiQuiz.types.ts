export type AIQuizDifficulty = "easy" | "medium" | "hard";

export type AIQuizQuestion = {
  id: string;
  question: string;
  options: string[];
  difficulty: AIQuizDifficulty;
  topic?: string | null;
};

export type AIQuiz = {
  id: string;
  title: string;
  subject: string;
  topic?: string | null;
  difficulty: AIQuizDifficulty;
  totalQuestions: number;
  createdAt: string;
  questions: AIQuizQuestion[];
};

export type AIQuizStartResponse = {
  success: boolean;
  message: string;
  attempt: {
    id: string;
    startedAt: string;
    submittedAt?: string | null;
    isSubmitted: boolean;
  };
  quiz: AIQuiz;
};

export type AIQuizHistoryItem = {
  quizId: string;
  title: string;
  subject: string;
  topic?: string | null;
  difficulty: AIQuizDifficulty;
  totalQuestions: number;
  createdAt: string;
  startedAt: string;
  submittedAt: string;
  score: number;
  total: number;
  percentage: number;
  weakTopics: string[];
  suggestedNextDifficulty: AIQuizDifficulty;
};

export type AIQuizHistoryResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  history: AIQuizHistoryItem[];
};

export type AIQuizResultQuestion = {
  id: string;
  question: string;
  options: string[];
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
  isCorrect: boolean;
  difficulty: AIQuizDifficulty;
  topic?: string | null;
};

export type AIQuizResult = {
  quizId: string;
  title: string;
  subject: string;
  topic?: string | null;
  difficulty: AIQuizDifficulty;
  createdAt: string;
  startedAt: string;
  submittedAt: string;
  score: number;
  total: number;
  percentage: number;
  analytics: {
    score: number;
    total: number;
    percentage: number;
    correctCount: number;
    incorrectCount: number;
    topicPerformance: {
      topic: string;
      total: number;
      correct: number;
      incorrect: number;
      percentage: number;
    }[];
    weakTopics: string[];
    difficultyDistribution: {
      difficulty: AIQuizDifficulty;
      total: number;
      correct: number;
      incorrect: number;
    }[];
    suggestedNextDifficulty: AIQuizDifficulty;
  };
  questions: AIQuizResultQuestion[];
};

export type AIQuizResultResponse = {
  success: boolean;
  result: AIQuizResult;
};

export type GenerateAIQuizPayload = {
  subject: string;
  difficulty: AIQuizDifficulty;
  numberOfQuestions: number;
  topic?: string;
};
