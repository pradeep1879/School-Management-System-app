import { Badge } from "@/components/ui/badge";


interface SubjectResult {
  subjectName: string;
  obtainedMarks: number;
  totalMarks: number;
  status: "PASS" | "FAIL";
}

interface Props {
  subjects: SubjectResult[];
}

export default function SubjectResultTable({
  subjects,
}: Props) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            <th className="p-3 text-left">Subject</th>
            <th className="p-3 text-left">Marks</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {subjects.map((sub: any) => (
            <tr key={sub.subjectName} className="border-t">
              <td className="p-3">
                {sub.subjectName}
              </td>
              <td className="p-3">
                {sub.obtainedMarks}/{sub.totalMarks}
              </td>
              <td className="p-3">
                <Badge
                  variant={
                    sub.status === "PASS"
                      ? "secondary"
                      : "destructive"
                  }
                >
                  {sub.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}