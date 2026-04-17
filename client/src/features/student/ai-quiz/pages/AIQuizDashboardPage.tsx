import { ArrowRight, BarChart3, BrainCircuit, Sparkles, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useStudentProfile } from "../../hooks/useStudentProfile";
import { AIQuizConfigDialog } from "../components/AIQuizConfigDialog";
import { AIQuizHistoryList } from "../components/AIQuizHistoryList";

const AIQuizDashboardPage = () => {
  const { data } = useStudentProfile();
  const student = data?.student;
  const highlights = [
    {
      title: "Targeted revision",
      description: "Generate quizzes by subject, topic, and difficulty for faster practice.",
      icon: BrainCircuit,
    },
    {
      title: "Instant review",
      description: "See score, worked explanations, and topic-wise performance after submission.",
      icon: BarChart3,
    },
    {
      title: "Adaptive guidance",
      description: "Use suggested next difficulty and weak-topic insights to improve steadily.",
      icon: Target,
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="gap-6 border-b bg-muted/15">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Personalized practice for {student?.class?.slug} {student?.class?.section}
              </div>
              <CardTitle className="text-2xl sm:text-3xl">
              AI Quiz Practice
              </CardTitle>
              <CardDescription className="max-w-2xl text-sm leading-6 sm:text-base">
                Generate custom quizzes for {student?.class?.slug} {student?.class?.section} using your own subject, difficulty, and topic selection.
              </CardDescription>
            </div>

            <AIQuizConfigDialog
              trigger={
                <Button className="h-11 gap-2 self-start px-5 md:self-auto">
                  <Sparkles className="h-4 w-4" />
                  Take AI Quiz
                  <ArrowRight className="h-4 w-4" />
                </Button>
              }
            />
          </div>
        </CardHeader>

        <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border bg-card/70 p-4 shadow-sm transition-colors hover:bg-muted/20"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Recent Attempts</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Review completed quizzes and spot patterns in your performance.
          </p>
        </div>
        <AIQuizHistoryList />
      </div>
    </div>
  );
};

export default AIQuizDashboardPage;
