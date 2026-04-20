import { useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Bell,
  BookOpen,
  CalendarClock,
  GraduationCap,
  UserCheck,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

import { useTeacherProfile } from "@/features/teacher/hooks/useTeacherProfile";
import { useTeacherClass } from "@/features/class/hooks/useTeacherClass";
import { formatClassLabel } from "@/features/class/utils/classLabels";
import { useAnnouncements } from "@/features/announcements/hooks/useAnnouncements";
import AttendanceActionCard from "@/features/teacherAttendance/components/AttendanceActionCard";
import { useMyAttendance, useTodayAttendance } from "@/features/teacherAttendance/hooks/useMyAttendance";
import { TodayScheduleWidget } from "@/features/timetable/components/TodayScheduleWidget";

const percentage = (part: number, total: number) =>
  total > 0 ? Number(((part / total) * 100).toFixed(1)) : 0;

const getInitials = (name?: string) =>
  name
    ?.split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2) ?? "T";

const statusTone: Record<string, string> = {
  PRESENT: "text-emerald-300 border-emerald-400/20 bg-emerald-400/10",
  ABSENT: "text-rose-300 border-rose-400/20 bg-rose-400/10",
  LEAVE: "text-amber-300 border-amber-400/20 bg-amber-400/10",
  HALF_DAY: "text-sky-300 border-sky-400/20 bg-sky-400/10",
  HOLIDAY: "text-indigo-300 border-indigo-400/20 bg-indigo-400/10",
};

const TeacherOverviewCard = ({
  title,
  value,
  meta,
  icon: Icon,
}: {
  title: string;
  value: string;
  meta: string;
  icon: typeof GraduationCap;
}) => (
  <Card className="border-border/60 py-0">
    <CardContent className="flex items-start justify-between gap-4 p-5">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{meta}</p>
      </div>
      <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
);

export default function TeacherDashboard() {
  const { data, isLoading } = useTeacherProfile();
  const { data: teacherClassData, isLoading: teacherClassLoading } = useTeacherClass(true);
  const { data: announcementsData, isLoading: announcementsLoading } = useAnnouncements();
  const { data: attendanceHistory, isLoading: attendanceHistoryLoading } = useMyAttendance({
    enabled: true,
  });
  const { data: todayAttendance, isLoading: todayAttendanceLoading } = useTodayAttendance();

  const attendanceSummary = useMemo(() => {
    const records = attendanceHistory || [];
    const summary = {
      present: 0,
      absent: 0,
      leave: 0,
      halfDay: 0,
      holiday: 0,
      total: records.length,
    };

    records.forEach((record: any) => {
      switch (record.status) {
        case "PRESENT":
          summary.present += 1;
          break;
        case "ABSENT":
          summary.absent += 1;
          break;
        case "LEAVE":
          summary.leave += 1;
          break;
        case "HALF_DAY":
          summary.halfDay += 1;
          break;
        case "HOLIDAY":
          summary.holiday += 1;
          break;
      }
    });

    const counted = summary.present + summary.absent + summary.leave + summary.halfDay;
    const attended = summary.present + summary.halfDay * 0.5;

    return {
      ...summary,
      percentage: percentage(attended, counted),
      counted,
    };
  }, [attendanceHistory]);

  if (isLoading || teacherClassLoading || attendanceHistoryLoading || todayAttendanceLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-44 w-full rounded-2xl" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
          <Skeleton className="h-105 rounded-2xl" />
          <div className="grid gap-6">
            <Skeleton className="h-72 rounded-2xl" />
            <Skeleton className="h-72 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const teacher = data?.teacher;
  const classDetail = teacherClassData?.classDetail;
  const teacherName = teacher?.teacherName || "Teacher";
  const subjectNames = teacher?.subjects?.map((subject:any) => subject.name) ?? [];
  const classLabel = classDetail ? formatClassLabel(classDetail) : "No class assigned";
  const announcements = announcementsData?.announcements?.slice(0, 4) ?? [];

  const recentAttendance = (attendanceHistory || []).slice(0, 4);
  const todayStatusLabel = todayAttendance?.status
    ? todayAttendance.status.toLowerCase().replace("_", " ")
    : "Not submitted";

  return (
    <div className="space-y-6">
      <Card className="border-border/60 py-0">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 rounded-2xl ring-1 ring-border/60 sm:h-20 sm:w-20">
                <AvatarImage src={teacher?.imageUrl} />
                <AvatarFallback className="rounded-2xl text-lg font-semibold">
                  {getInitials(teacherName)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-3">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {teacherName}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground sm:text-base">
                    Your class schedule, attendance request, and announcements for the day.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {subjectNames.slice(0, 3).map((subject:any) => (
                    <Badge key={subject} variant="secondary" className="rounded-full">
                      {subject}
                    </Badge>
                  ))}
                  {classDetail ? (
                    <Badge variant="outline" className="rounded-full">
                      {classDetail.slug} - {classDetail.section}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:w-105 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Today
                </p>
                <p className="mt-2 text-xl font-semibold capitalize">{todayStatusLabel}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {todayAttendance?.approvalStatus
                    ? `Approval ${todayAttendance.approvalStatus.toLowerCase()}`
                    : "Attendance request pending"}
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Assigned class
                </p>
                <p className="mt-2 text-xl font-semibold">{classDetail ? `${classDetail.slug}-${classDetail.section}` : "--"}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {classDetail?._count?.students ?? 0} students
                </p>
              </div>
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Attendance rate
                </p>
                <p className="mt-2 text-xl font-semibold">{attendanceSummary.percentage}%</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {attendanceSummary.counted} recorded days
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            {classLabel}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
        <TeacherOverviewCard
          title="Assigned Students"
          value={String(classDetail?._count?.students ?? 0)}
          meta={classDetail ? `${classDetail.slug}-${classDetail.section} currently assigned` : "No class assignment yet"}
          icon={Users}
        />
        <TeacherOverviewCard
          title="Subjects"
          value={String(subjectNames.length)}
          meta={subjectNames.length ? subjectNames.slice(0, 2).join(", ") : "No subject assigned yet"}
          icon={BookOpen}
        />
        <TeacherOverviewCard
          title="Unread Announcements"
          value={String(announcementsData?.unreadCount ?? 0)}
          meta={announcements.length ? announcements[0].title : "No new announcements"}
          icon={Bell}
        />
        <TeacherOverviewCard
          title="Attendance Records"
          value={String(attendanceSummary.total)}
          meta={`${attendanceSummary.present} present, ${attendanceSummary.absent + attendanceSummary.leave + attendanceSummary.halfDay} exception days`}
          icon={UserCheck}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        <div className="grid gap-6">
          <AttendanceActionCard />
         

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Recent Announcements</CardTitle>
              <CardDescription>
                Latest messages shared with teachers and your class.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 pb-6">
              {announcementsLoading ? (
                <Skeleton className="h-40 w-full rounded-2xl" />
              ) : announcements.length ? (
                announcements.map((announcement: any) => (
                  <div
                    key={announcement.id}
                    className="rounded-2xl border border-border/60 bg-muted/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{announcement.title}</p>
                        <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                          {announcement.message}
                        </p>
                      </div>
                      {!announcement.isRead ? (
                        <Badge variant="secondary" className="rounded-full">
                          New
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>{announcement.senderName || announcement.senderRole}</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                  No announcements yet.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
           <TodayScheduleWidget title="Today's Classes" />

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">Attendance Summary</CardTitle>
              <CardDescription>
                Your recent attendance pattern from approved records.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pb-6">
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Attendance rate</p>
                    <p className="mt-2 text-3xl font-semibold">{attendanceSummary.percentage}%</p>
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-background/50 p-3">
                    <CalendarClock className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
                <Progress
                  value={attendanceSummary.percentage}
                  className="mt-5 h-2 bg-secondary/70"
                  indicatorClassName="bg-gradient-to-r from-emerald-400 to-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-sm text-muted-foreground">Present</p>
                  <p className="mt-2 text-2xl font-semibold">{attendanceSummary.present}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-sm text-muted-foreground">Exceptions</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {attendanceSummary.absent + attendanceSummary.leave + attendanceSummary.halfDay}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {recentAttendance.length ? (
                  recentAttendance.map((record: any) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {formatShortDate(record.date)}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          Approval {record.approvalStatus.toLowerCase()}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`rounded-full capitalize ${statusTone[record.status] || ""}`}
                      >
                        {record.status.toLowerCase().replace("_", " ")}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/60 p-6 text-sm text-muted-foreground">
                    No attendance history yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function formatShortDate(value?: string) {
  return value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        timeZone: "Asia/Kolkata",
      })
    : "--";
}
