import { Badge } from "@/components/ui/badge";

const statusColor: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  ONGOING: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-green-100 text-green-700",
};

interface Props {
  chapter: any;
  index: number;
  role: string | any;
  onStatusChange: (chapterId: string, status: string) => void;
}

export default function ChapterCard({
  chapter,
  index,
  role,
  onStatusChange,
}: Props) {
  
  return (
    <div className="border rounded-xl p-6 bg-card hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">
          {index + 1}. {chapter.title}
        </h3>

        <Badge className={statusColor[chapter.status]}>
          {chapter.status}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground mt-3">
        {chapter.description}
      </p>

      {(role === "admin" || role === "teacher") && (
        <div className="flex gap-2 mt-4">
          {["PENDING", "ONGOING", "COMPLETED"].map((status) => (
            <button
              key={status}
              onClick={() => onStatusChange(chapter.id, status)}
              className="text-xs cursor-pointer px-3 py-1 border rounded-md hover:bg-muted"
            >
              {status}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}