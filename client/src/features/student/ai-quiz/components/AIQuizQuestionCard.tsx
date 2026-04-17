import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AIQuizQuestion } from "../types/aiQuiz.types";

type AIQuizQuestionCardProps = {
  question: AIQuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: string;
  answeredCount: number;
  elapsedLabel: string;
  onSelectAnswer: (answer: string) => void;
};

export const AIQuizQuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  answeredCount,
  elapsedLabel,
  onSelectAnswer,
}: AIQuizQuestionCardProps) => {
  const progressValue = Math.round((questionNumber / totalQuestions) * 100);

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Question {questionNumber} of {totalQuestions}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                {question.difficulty}
              </Badge>
              {question.topic ? <Badge variant="secondary">{question.topic}</Badge> : null}
            </div>
            <p className="text-sm text-muted-foreground">
              Answered {answeredCount}/{totalQuestions} · {elapsedLabel}
            </p>
          </div>
        </div>

        <Progress value={progressValue} />

        <CardTitle className="text-xl leading-8">{question.question}</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-3">
        {question.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onSelectAnswer(option)}
            className={cn(
              "rounded-xl border px-4 py-3 text-left text-sm transition-colors",
              selectedAnswer === option
                ? "border-primary bg-primary/8 text-foreground"
                : "bg-background hover:bg-muted/50",
            )}
          >
            {option}
          </button>
        ))}
      </CardContent>
    </Card>
  );
};
