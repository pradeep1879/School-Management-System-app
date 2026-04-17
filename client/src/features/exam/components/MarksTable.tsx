import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

interface Props {
  examSubject: any;
  examStatus: string;
  onSave: (updates: any[]) => void;
  isSaving: boolean;
}

const MarksTable = ({
  examSubject,
  examStatus,
  onSave,
  isSaving,
}: Props) => {
  const [marks, setMarks] = useState<any[]>(
    examSubject?.results.map((r: any) => ({
      resultId: r.id,
      obtainedMarks: r.obtainedMarks ?? "",
    }))
  );

  const handleChange = (index: number, value: string) => {
    const updated = [...marks];
    updated[index].obtainedMarks = value;
    setMarks(updated);
  };

  const isLocked = examStatus === "PUBLISHED";

  return (
    <div className="space-y-6">
      <div className="custom-scrollbar overflow-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Roll</th>
              <th className="p-3 text-left">Student</th>
              <th className="p-3 text-left">Marks</th>
            </tr>
          </thead>
          <tbody>
            {examSubject?.results.map((result: any, index: number) => (
              <tr key={result.id} className="border-t">
                <td className="p-3">
                  {result.student.rollNumber}
                </td>
                <td className="p-3">
                  {result.student.studentName}
                </td>
                <td className="p-3 w-40">
                  <Input
                    type="number"
                    disabled={isLocked}
                    value={marks[index]?.obtainedMarks}
                    onChange={(e) =>
                      handleChange(index, e.target.value)
                    }
                    max={examSubject.totalMarks}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLocked && (
        <Button
          onClick={() => onSave(marks)}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving
            </span>
          ) : (
            "Save Marks"
          )}
        </Button>
      )}
    </div>
  );
};

export default MarksTable;
