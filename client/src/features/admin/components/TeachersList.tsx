import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTeachers } from "@/features/teacher/hooks/useTeacher";
import { Loader2 } from "lucide-react";
import CountUp from "react-countup";
import { Button } from "@/components/ui/button";

interface TeachersTableProps {
  limit?: number;
}

const TeachersTable = ({ limit = 10 }: TeachersTableProps) => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useTeachers(page, limit);

  const totalPages = data?.totalPages || 1;

  return (
    <div className="h-full">
      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Fetching teachers...
          </p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <p className="text-center text-red-500 py-6">
          Failed to load teachers
        </p>
      )}

      {/* Table */}
      {!isLoading && !isError && (
        <>
          <div className="custom-div-scroll w-full max-w-full overflow-x-auto">
            <div className="min-w-190">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Salary</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {data?.teachers?.map((teacher: any) => (
                    <TableRow
                      key={teacher.id}
                      onClick={() =>
                        navigate(`/admin/teacher-profile/${teacher.id}`)
                      }
                      className="cursor-pointer hover:bg-muted/40 transition"
                    >
                      <TableCell>
                        <div className="flex min-w-0 items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={teacher.imageUrl} />
                            <AvatarFallback>
                              {teacher.teacherName?.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0">
                            <p className="truncate font-medium">
                              {teacher.teacherName}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {teacher.experience}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="text-muted-foreground">
                        {teacher.email}
                      </TableCell>

                      <TableCell>{teacher.experience}</TableCell>

                      <TableCell>
                        <Badge variant="secondary">Active</Badge>
                      </TableCell>

                      <TableCell className="text-right font-medium">
                        {teacher.salaryStructures?.map((bs: any) => (
                          <CountUp
                            key={bs.id}
                            end={bs?.baseSalary || 0}
                            duration={1.2}
                            separator=","
                            prefix="₹"
                          />
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-sm text-muted-foreground sm:text-left">
              Page {page} of {totalPages}
            </p>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>

              <Button
                variant="outline"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeachersTable;
