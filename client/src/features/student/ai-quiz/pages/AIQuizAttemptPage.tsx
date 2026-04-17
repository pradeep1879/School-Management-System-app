import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AIQuizQuestionCard } from "../components/AIQuizQuestionCard";
import { useAIQuizStartSession, useSubmitAIQuiz } from "../hooks/useAIQuiz";
import { useAIQuizStore } from "../store/aiQuiz.store";
import type { AIQuiz } from "../types/aiQuiz.types";

const formatElapsedTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`;
};

const AIQuizAttemptPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [localQuiz, setLocalQuiz] = useState<AIQuiz | null>(null);
  const [localStartedAt, setLocalStartedAt] = useState<string | null>(null);
  const [localElapsedSeconds, setLocalElapsedSeconds] = useState(0);
  const startQuery = useAIQuizStartSession(quizId);
  const submitMutation = useSubmitAIQuiz();
  const {
    quiz,
    answers,
    startedAt,
    currentQuestionIndex,
    elapsedSeconds,
    setSession,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    syncElapsedFromStart,
    resetQuizSession,
  } = useAIQuizStore();

  const resolvedQuiz = useMemo(
    () => (quiz?.id === quizId ? quiz : localQuiz),
    [localQuiz, quiz, quizId],
  );

  const resolvedElapsedSeconds =
    quiz?.id === quizId ? elapsedSeconds : localElapsedSeconds;

  useEffect(() => {
    if (!quizId) {
      return;
    }

    if (startQuery.isError) {
      toast.error(
        startQuery.error instanceof Error
          ? startQuery.error.message
          : "Unable to start quiz",
      );
      navigate("/student/ai-quiz", { replace: true });
      return;
    }

    if (!startQuery.data) {
      return;
    }

    if (startQuery.data.attempt.isSubmitted) {
      navigate(`/student/ai-quiz/result/${quizId}`, { replace: true });
      return;
    }

    setLocalQuiz(startQuery.data.quiz);
    setLocalStartedAt(startQuery.data.attempt.startedAt);
    setSession({
      quiz: startQuery.data.quiz,
      attemptId: startQuery.data.attempt.id,
      startedAt: startQuery.data.attempt.startedAt,
    });
  }, [navigate, quizId, setSession, startQuery.data, startQuery.error, startQuery.isError]);

  useEffect(() => {
    if (quiz?.id === quizId) {
      setLocalQuiz(quiz);
      setLocalStartedAt(startedAt);
    }
  }, [quiz, quizId, startedAt]);

  useEffect(() => {
    if (!resolvedQuiz?.id) {
      return;
    }

    if (quiz?.id === quizId) {
      syncElapsedFromStart();
    }

    const updateLocalElapsed = () => {
      if (localStartedAt) {
        setLocalElapsedSeconds(
          Math.max(
            Math.floor((Date.now() - new Date(localStartedAt).getTime()) / 1000),
            0,
          ),
        );
      }
    };

    updateLocalElapsed();
    const timer = window.setInterval(() => {
      syncElapsedFromStart();
      updateLocalElapsed();
    }, 1000);

    return () => window.clearInterval(timer);
  }, [localStartedAt, quiz?.id, quizId, resolvedQuiz?.id, syncElapsedFromStart]);

  if (startQuery.isLoading || !resolvedQuiz || resolvedQuiz.id !== quizId) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-[420px] w-full rounded-xl" />
      </div>
    );
  }

  const currentQuestion = resolvedQuiz.questions[currentQuestionIndex];
  const answeredCount = Object.values(answers).filter(Boolean).length;
  const isLastQuestion = currentQuestionIndex === resolvedQuiz.questions.length - 1;

  const handleSubmit = () => {
    submitMutation.mutate(
      {
        quizId: resolvedQuiz.id,
        answers: resolvedQuiz.questions
          .filter((question) => answers[question.id])
          .map((question) => ({
            questionId: question.id,
            selectedAnswer: answers[question.id],
          })),
      },
      {
        onSuccess: (data) => {
          resetQuizSession();
          toast.success("Quiz submitted successfully");
          navigate(`/student/ai-quiz/result/${data.result.quizId}`, { replace: true });
        },
      },
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{resolvedQuiz.title}</h1>
          <p className="text-sm text-muted-foreground">
            {resolvedQuiz.subject}
            {resolvedQuiz.topic ? ` · ${resolvedQuiz.topic}` : ""}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Time elapsed: <span className="font-medium text-foreground">{formatElapsedTime(resolvedElapsedSeconds)}</span>
        </div>
      </div>

      <AIQuizQuestionCard
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={resolvedQuiz.questions.length}
        selectedAnswer={answers[currentQuestion.id]}
        answeredCount={answeredCount}
        elapsedLabel={formatElapsedTime(resolvedElapsedSeconds)}
        onSelectAnswer={(answer) => selectAnswer(currentQuestion.id, answer)}
      />

      <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          You can move between questions before submitting.
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          {!isLastQuestion ? (
            <Button onClick={nextQuestion}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitMutation.isPending}>
              {submitMutation.isPending ? "Submitting..." : "Submit quiz"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIQuizAttemptPage;
