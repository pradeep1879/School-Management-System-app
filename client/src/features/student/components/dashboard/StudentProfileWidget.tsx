import { format } from "date-fns";
import { ChevronRight, GraduationCap, IdCard, Phone, UserRound } from "lucide-react";

import type { DashboardStudentProfile } from "../../types/dashboard.types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface StudentProfileWidgetProps {
  student?: DashboardStudentProfile;
}

const StudentProfileWidget = ({ student }: StudentProfileWidgetProps) => {
  const initials = student?.studentName
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  const detailItems = [
    { label: "Username", value: student?.userName || "Not available", icon: UserRound },
    { label: "Contact", value: student?.contactNo || "Not available", icon: Phone },
    { label: "Class", value: student ? `${student.class.slug} • ${student.class.section}` : "Not available", icon: GraduationCap },
    { label: "Roll Number", value: student?.rollNumber || "Not available", icon: IdCard },
  ];

  return (
    <Card className="rounded-[28px] border-border/60 bg-card/80 shadow-[0_20px_50px_-34px_rgba(124,58,237,0.65)]">
      <CardContent className="space-y-5 p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border border-white/10 shadow-lg">
            <AvatarImage src={student?.imageUrl || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
              {initials || "ST"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 space-y-2">
            <div>
              <p className="truncate text-lg font-semibold">{student?.studentName || "Student"}</p>
              <p className="text-sm text-muted-foreground">
                {student ? `${student.class.slug} • Section ${student.class.section}` : "Class information unavailable"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
                Roll #{student?.rollNumber || "--"}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                Session {student?.class.session || "--"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {detailItems.slice(0, 2).map((item) => (
            <div key={item.label} className="rounded-2xl border border-border/60 bg-background/40 p-3">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item.label}</p>
              <p className="mt-2 text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between rounded-2xl">
              View full profile
              <ChevronRight className="h-4 w-4" />
            </Button>
          </SheetTrigger>

          <SheetContent className="border-border/70 bg-background/95 text-foreground sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Student Profile</SheetTitle>
              <SheetDescription>
                Updated snapshot for {student?.studentName || "the student"} on{" "}
                {format(new Date(), "dd MMM yyyy")}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-8 space-y-4">
              {detailItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card/80 p-4"
                >
                  <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-primary">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium">{item.value}</p>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-border/60 bg-card/80 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Session Details
                </p>
                <p className="mt-2 text-sm font-medium">
                  {student?.class.slug || "--"} / {student?.class.section || "--"} /{" "}
                  {student?.class.session || "--"}
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default StudentProfileWidget;
