import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  exams: any[];
  selectedExam: string | undefined;
  onChange: (examId: string) => void;
}

const ExamSelector = ({ exams, selectedExam, onChange }: Props) => {
  return (
    <div className="w-60">
      <Select value={selectedExam} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select Exam" />
        </SelectTrigger>

        <SelectContent>
          {exams.map((exam) => (
            <SelectItem key={exam.id} value={exam.id}>
              {exam.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ExamSelector;