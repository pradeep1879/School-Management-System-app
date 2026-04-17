import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, Clock3, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAIQuizHistory } from "../hooks/useAIQuiz";

export const AIQuizHistoryList = () => {
  const { data, isLoading } = useAIQuizHistory({ page: 1, limit: 8 });

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data?.history?.length) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">No AI quizzes attempted yet</p>
            <p className="text-sm text-muted-foreground">
              Your completed quizzes and performance trends will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {data.history.map((item) => (
        <Card key={item.quizId} className="overflow-hidden">
          <CardHeader className="gap-4 border-b bg-muted/10">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-lg leading-8">{item.title}</CardTitle>
                <CardDescription className="text-sm">
                  {item.subject}
                  {item.topic ? ` · ${item.topic}` : ""}
                </CardDescription>
              </div>
              <Badge variant="outline" className="capitalize shrink-0">
                {item.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border bg-muted/15 p-3">
                <p className="text-xs text-muted-foreground">Score</p>
                <p className="mt-1 text-2xl font-semibold">
                  {item.score}/{item.total}
                </p>
              </div>
              <div className="rounded-xl border bg-muted/15 p-3">
                <p className="text-xs text-muted-foreground">Percentage</p>
                <p className="mt-1 text-2xl font-semibold">{item.percentage}%</p>
              </div>
              <div className="rounded-xl border bg-muted/15 p-3">
                <p className="text-xs text-muted-foreground">Next</p>
                <p className="mt-1 text-xl font-semibold capitalize">
                  {item.suggestedNextDifficulty}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 className="h-4 w-4" />
                Attempted on {new Date(item.submittedAt).toLocaleString()}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BrainCircuit className="h-4 w-4" />
                {item.totalQuestions} questions
              </div>
            </div>

            {item.weakTopics.length > 0 && (
              <div className="rounded-xl border bg-muted/10 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Target className="h-4 w-4 text-primary" />
                  Focus next on
                </div>
                <div className="flex flex-wrap gap-2">
                {item.weakTopics.map((topic) => (
                    <Badge key={topic} variant="secondary" className="rounded-full px-3 py-1">
                    {topic}
                  </Badge>
                ))}
                </div>
              </div>
            )}

            <Button asChild variant="outline" className="w-full justify-between rounded-xl">
              <Link to={`/student/ai-quiz/result/${item.quizId}`}>
                View result
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
