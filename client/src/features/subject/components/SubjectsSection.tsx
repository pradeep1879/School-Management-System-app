import {
  Plus,
  MoreVertical,
  Search,
  BookOpen,
  Clock,
  MapPin,
  Pencil,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import AddSubjectDialog from "./forms/AddSubjectDialog";
import AddSyllabusDialog from "./forms/AddSyllabusDialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useSubjects } from "../hooks/useSubjects";
import { useDebounce } from "@/features/student/hooks/useDebounce";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";

interface Props {
  classId: string;
  canEdit: boolean;
}

export default function SubjectsSection({ classId, canEdit }: Props) {
  const [search, setSearch] = useState("");
  const [subjectDialogOpen, setSubjectDialogOpen] = useState(false);
  const { role } = useAuthStore();

  //  Syllabus Dialog State
  const [syllabusOpen, setSyllabusOpen] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    null,
  );

  const navigate = useNavigate();
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useSubjects(classId);
  const subjects = data?.subjects || [];

  const filteredSubjects = subjects.filter((subject: any) =>
    subject.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Subjects</h2>
          <p className="text-sm text-muted-foreground">
            Subjects assigned to this class
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subject..."
              className="pl-9"
            />
          </div>

          {canEdit && (
            <Dialog
              open={subjectDialogOpen}
              onOpenChange={setSubjectDialogOpen}
            >
              <Button onClick={() => setSubjectDialogOpen(true)}>
                <Plus size={16} /> Add Subject
              </Button>
              <AddSubjectDialog
                classId={classId}
                setOpen={setSubjectDialogOpen}
              />
            </Dialog>
          )}
        </div>
      </div>

      {/* SEARCH */}

      {isLoading && subjects.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-6 bg-card space-y-5">
              {/* TOP SECTION */}
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />

                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>

                <Skeleton className="h-8 w-8 rounded-md" />
              </div>

              {/* TEACHER */}
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-28" />
              </div>

              {/* META */}
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-28 rounded-md" />
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      )}
      {/* GRID */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSubjects.map((subject: any) => (
            <div
              key={subject.id}
              className="border rounded-xl p-6 bg-card hover:shadow-lg transition"
            >
              {/* TOP */}
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <BookOpen size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg">{subject.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {subject.code}
                    </p>
                  </div>
                </div>

                {canEdit && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil size={14} /> Edit
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* TEACHER */}
              <div className="flex items-center gap-3 mt-5">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {subject.teacher?.teacherName
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2) || "NA"}
                  </AvatarFallback>
                </Avatar>

                <p className="text-sm text-muted-foreground">
                  {subject.teacher?.teacherName || "Not Assigned"}
                </p>
              </div>

              {/* META */}
              <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={14} />
                  {subject.periods || 0} /week
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={14} />
                  Room {subject.room || "—"}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="mt-5 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className={`${role === "student" ? "col-span-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white" : ""}`}
                  onClick={() =>
                    navigate(`/${role}/subjects/${subject.id}/syllabus`)
                  }
                >
                  View Syllabus
                </Button>

                {canEdit && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedSubjectId(subject.id);
                      setSyllabusOpen(true);
                    }}
                  >
                    Add Syllabus
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/*  SINGLE GLOBAL SYLLABUS DIALOG */}
      <Dialog open={syllabusOpen} onOpenChange={setSyllabusOpen}>
        {selectedSubjectId && (
          <AddSyllabusDialog
            subjectId={selectedSubjectId}
            onSuccess={() => setSyllabusOpen(false)}
          />
        )}
      </Dialog>
    </div>
  );
}
