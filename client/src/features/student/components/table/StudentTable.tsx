import {
  MoreVertical,
  Search,
  Filter,
  Loader2,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import { useDebounce } from "@/features/student/hooks/useDebounce";
import { useStudentsByClass } from "@/features/student/hooks/useStudentByClass";

interface StudentsTableProps {
  classId: string;
  profileBasePath: string; 
}

export default function StudentsTable({
  classId,
  profileBasePath,
}: StudentsTableProps) {
  const navigate = useNavigate();
  console.log("profileBasePath",   profileBasePath)

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useStudentsByClass(
    classId,
    page,
    10,
    debouncedSearch
  );

  const students = data?.students || [];

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Students</h2>
          <p className="text-sm text-muted-foreground">
            All students enrolled in this class
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>

          <Button variant="outline" size="icon">
            <Filter size={16} />
          </Button>
        </div>
      </div>

      {/* ================= LOADING ================= */}
      {isLoading && (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {/* ================= TABLE ================= */}
      {!isLoading && (
        <>
          <div className="rounded-xl border custom-scrollbar border-border/50 overflow-x-auto">
            <table className="w-full min-w-225 text-sm">
              <thead className="bg-muted/40 border-b border-border/50">
                <tr className="text-left">
                  <th className="p-4">
                    <Checkbox />
                  </th>
                  <th className="p-4">Roll</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Gender</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4"></th>
                </tr>
              </thead>

              <tbody>
                {students.map((student: any) => (
                  <tr
                    key={student.id}
                    onClick={() =>
                      navigate(
                        `${profileBasePath}/student-profile/${student.id}`
                      )
                    }
                    className="border-b cursor-pointer border-border/30 hover:bg-muted/30 transition"
                  >
                    <td className="p-4">
                      <Checkbox />
                    </td>

                    <td className="p-4 font-medium">
                      {student.rollNumber}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={student.imageUrl} />
                          <AvatarFallback>
                            {student.studentName
                              ?.split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="font-medium">
                          {student.studentName}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 text-muted-foreground">
                      {student.contactNo}
                    </td>

                    <td className="p-4">
                      <Badge variant="outline">
                        {student.gender}
                      </Badge>
                    </td>

                    <td className="p-4 text-muted-foreground">
                      {new Date(
                        student.createdAt
                      ).toLocaleDateString("en-GB")}
                    </td>

                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ================= EMPTY STATE ================= */}
          {students.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              No students found
            </div>
          )}

          {/* ================= PAGINATION ================= */}
          {data?.totalPages > 1 && (
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </Button>

              <p className="text-sm text-muted-foreground">
                Page {data?.page} of {data?.totalPages}
              </p>

              <Button
                variant="outline"
                disabled={page === data?.totalPages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}