import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ChevronDown, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AIQuizAnalyticsCharts } from "../components/AIQuizAnalyticsCharts";
import { useAIQuizResult } from "../hooks/useAIQuiz";

const AIQuizResultPage = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const { data, isLoading } = useAIQuizResult(quizId);

  if (isLoading || !data?.result) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-44 w-full rounded-xl" />
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const { result } = data;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{result.title}</CardTitle>
            <CardDescription>
              {result.subject}
              {result.topic ? ` · ${result.topic}` : ""}
            </CardDescription>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="capitalize">
                {result.difficulty}
              </Badge>
              {result.analytics.weakTopics.map((topic) => (
                <Badge key={topic} variant="secondary">
                  Weak: {topic}
                </Badge>
              ))}
            </div>
          </div>

          <div className="w-full max-w-sm rounded-2xl border bg-muted/20 p-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-background/70 p-3">
                <p className="text-xs text-muted-foreground">Score</p>
                <p className="mt-1 text-2xl font-bold">
                  {result.score}/{result.total}
                </p>
              </div>
              <div className="rounded-xl bg-background/70 p-3">
                <p className="text-xs text-muted-foreground">Accuracy</p>
                <p className="mt-1 text-2xl font-bold">{result.percentage}%</p>
              </div>
              <div className="rounded-xl bg-background/70 p-3">
                <p className="text-xs text-muted-foreground">Next</p>
                <p className="mt-1 text-base font-semibold capitalize">
                  {result.analytics.suggestedNextDifficulty}
                </p>
              </div>
            </div>

            <Button asChild className="mt-4 w-full gap-2">
              <Link to="/student/ai-quiz">
                <RotateCcw className="h-4 w-4" />
                Take another quiz
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <AIQuizAnalyticsCharts result={result} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Answer Review
          </CardTitle>
          <CardDescription>
            Review every answer with explanations and correct options.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.questions.map((question, index) => (
            <div
              key={question.id}
              className={cn(
                "rounded-xl border p-4",
                question.isCorrect
                  ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900 dark:bg-emerald-950/10"
                  : "border-red-200 bg-red-50/40 dark:border-red-900 dark:bg-red-950/10",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="font-medium">
                    {index + 1}. {question.question}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">
                      {question.difficulty}
                    </Badge>
                    {question.topic ? <Badge variant="secondary">{question.topic}</Badge> : null}
                  </div>
                </div>
                {question.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
              </div>

              <div className="mt-4 grid gap-2 text-sm">
                {question.options.map((option) => (
                  <div
                    key={option}
                    className={cn(
                      "rounded-lg border px-3 py-2",
                      option === question.correctAnswer &&
                        "border-emerald-300 bg-emerald-100/60 dark:border-emerald-900 dark:bg-emerald-950/20",
                      option === question.selectedAnswer &&
                        option !== question.correctAnswer &&
                        "border-red-300 bg-red-100/60 dark:border-red-900 dark:bg-red-950/20",
                    )}
                  >
                    {option}
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-2 text-sm">
                <p>
                  <span className="font-medium">Your answer:</span>{" "}
                  {question.selectedAnswer || "Not answered"}
                </p>
                <p>
                  <span className="font-medium">Correct answer:</span>{" "}
                  {question.correctAnswer}
                </p>
              </div>

              <Collapsible className="mt-4 group/collapsible rounded-xl border bg-background/60">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                  >
                    <div>
                      <p className="font-medium text-sm">View solution</p>
                      <p className="text-xs text-muted-foreground">
                        Show detailed explanation for this answer
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent className="border-t px-4 py-4 text-sm text-muted-foreground data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Detailed explanation</p>
                    <p className="leading-6">{question.explanation}</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIQuizResultPage;
