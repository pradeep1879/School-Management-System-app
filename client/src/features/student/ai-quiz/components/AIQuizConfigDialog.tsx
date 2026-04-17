import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSubjects } from "@/features/subject/hooks/useSubjects";
import { useStudentProfile } from "../../hooks/useStudentProfile";
import { useGenerateAIQuiz } from "../hooks/useAIQuiz";
import type { AIQuizDifficulty } from "../types/aiQuiz.types";

type AIQuizConfigDialogProps = {
  trigger?: React.ReactNode;
};

const difficulties: { value: AIQuizDifficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export const AIQuizConfigDialog = ({ trigger }: AIQuizConfigDialogProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState<AIQuizDifficulty>("medium");
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [topic, setTopic] = useState("");
  const { data: studentProfile } = useStudentProfile();
  const classId = studentProfile?.student?.class?.id;
  const { data: subjectsData } = useSubjects(classId);
  const generateMutation = useGenerateAIQuiz();
  const subjects = useMemo(
    () => subjectsData?.subjects?.map((item: { id: string; name: string }) => item.name) ?? [],
    [subjectsData],
  );

  const handleGenerate = () => {
    if (!subject) {
      toast.error("Please select a subject");
      return;
    }

    generateMutation.mutate(
      {
        subject,
        difficulty,
        numberOfQuestions,
        topic: topic.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          setOpen(false);
          toast.success(data.message || "AI quiz ready");
          navigate(`/student/ai-quiz/attempt/${data.quiz.id}`);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Failed to generate AI quiz",
          );
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button className="gap-2">
            <Sparkles className="h-4 w-4" />
            Take AI Quiz
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create AI Quiz
          </DialogTitle>
          <DialogDescription>
            Generate a quiz from your class subjects with adjustable difficulty and topic focus.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label>Subject</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subjectName: string) => (
                  <SelectItem key={subjectName} value={subjectName}>
                    {subjectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Difficulty</Label>
              <Select
                value={difficulty}
                onValueChange={(value) => setDifficulty(value as AIQuizDifficulty)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Questions</Label>
              <Input
                type="number"
                min={3}
                max={20}
                value={numberOfQuestions}
                onChange={(event) =>
                  setNumberOfQuestions(
                    Math.min(
                      20,
                      Math.max(3, Number(event.target.value) || 5),
                    ),
                  )
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Topic (optional)</Label>
            <Input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Examples: Photosynthesis, Algebra, Mughal Empire"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={handleGenerate}
            disabled={generateMutation.isPending}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {generateMutation.isPending ? "Generating..." : "Generate quiz"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
