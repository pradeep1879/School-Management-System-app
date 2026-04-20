import {
  Banknote,
  BookCopy,
  CircleAlert,
  GraduationCap,
  IndianRupee,
  School,
  Users,
} from "lucide-react";
import DailyAttendanceChart from "./dashboardAnalytics/AttendaceBarGraph";
import { useDashboardAnalytics } from "../hooks/useAdminDashboard";
import { useAdminFinanceSummary } from "@/finance/fee/hooks/useAdminFinanceSummary";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const percentage = (part: number, total: number) =>
  total > 0 ? Number(((part / total) * 100).toFixed(1)) : 0;

const currency = (value?: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const formatShortDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        timeZone: "Asia/Kolkata",
      })
    : "--";

const OverviewCard = ({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof School;
}) => (
  <Card className="border-border/60 py-0">
    <CardContent className="flex items-start justify-between gap-4 p-5">
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
    </CardContent>
  </Card>
);

const StatCard = ({
  title,
  value,
  metaLeft,
  metaRight,
  progress,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  metaLeft: string;
  metaRight: string;
  progress: number;
  icon: typeof School;
  accent: string;
}) => (
  <Card className="border-border/60 py-0">
    <CardContent className="p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-muted/30 p-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <Progress
        value={progress}
        className="mt-5 h-2 bg-secondary/70"
        indicatorClassName={accent}
      />
      <div className="mt-3 flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>{metaLeft}</span>
        <span>{metaRight}</span>
      </div>
    </CardContent>
  </Card>
);

const LoadingBlock = () => (
  <div className="grid gap-5 sm:gap-6">
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-36 rounded-2xl" />
      ))}
    </div>
    <div className="grid gap-4 xl:grid-cols-3">
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-36 rounded-2xl" />
      <Skeleton className="h-36 rounded-2xl" />
    </div>
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
      <Skeleton className="h-[420px] rounded-2xl" />
      <div className="grid gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>
  </div>
);

const AdminAnalystics = () => {
  const { data: analytics, isLoading: analyticsLoading } = useDashboardAnalytics();
  const { data: finance, isLoading: financeLoading } = useAdminFinanceSummary();

  if (analyticsLoading || financeLoading) {
    return <LoadingBlock />;
  }

  const studentStats = analytics?.todayAttendance?.students;
  const teacherStats = analytics?.todayAttendance?.teachers;
  const classesMarked = analytics?.attendanceStatus?.classesMarked ?? 0;
  const pendingClasses = analytics?.attendanceStatus?.pendingClasses ?? 0;
  const totalClasses = analytics?.overview?.totalClasses ?? 0;
  const totalTeachers = analytics?.overview?.totalTeachers ?? 0;
  const totalStudents = analytics?.overview?.totalStudents ?? 0;

  const studentsTracked =
    (studentStats?.PRESENT ?? 0) +
    (studentStats?.ABSENT ?? 0) +
    (studentStats?.LEAVE ?? 0) +
    (studentStats?.HOLIDAY ?? 0);
  const teachersTracked =
    (teacherStats?.PRESENT ?? 0) +
    (teacherStats?.ABSENT ?? 0) +
    (teacherStats?.LEAVE ?? 0) +
    (teacherStats?.HOLIDAY ?? 0);

  const studentAttendanceRate = percentage(studentStats?.PRESENT ?? 0, studentsTracked);
  const teacherAttendanceRate = percentage(teacherStats?.PRESENT ?? 0, teachersTracked);
  const classCoverage = percentage(classesMarked, totalClasses);
  const collectionRate = percentage(finance?.totalCollected ?? 0, finance?.totalRevenue ?? 0);
  const dueRate = percentage(finance?.totalDue ?? 0, finance?.totalRevenue ?? 0);

  const topDueClasses = [...(finance?.classes ?? [])]
    .sort((a, b) => b.due - a.due)
    .slice(0, 4);

  const recentPayments = finance?.recentPayments?.slice(0, 5) ?? [];
  const latestPayment = recentPayments[0];

  return (
    <div className="grid gap-5 sm:gap-6">
      <div className="grid gap-4 grid-cols-2 md:grid-cols-2 xl:grid-cols-4">
        <OverviewCard
          title="Students"
          value={String(totalStudents)}
          description={`${totalTeachers} teachers across ${totalClasses} classes`}
          icon={GraduationCap}
        />
        <OverviewCard
          title="Collected Fee"
          value={`₹${currency(finance?.totalCollected)}`}
          description={`₹${currency(finance?.totalDue)} still due`}
          icon={Banknote}
        />
        <OverviewCard
          title="Today Collection"
          value={`₹${currency(finance?.todayCollection)}`}
          description="Payments recorded today"
          icon={IndianRupee}
        />
        <OverviewCard
          title="Pending Actions"
          value={String((finance?.overdueStudents ?? 0) + pendingClasses)}
          description={`${pendingClasses} attendance gaps, ${finance?.overdueStudents ?? 0} overdue fee cases`}
          icon={CircleAlert}
        />
      </div>

      <div className="grid gap-4 grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Student Attendance"
          value={`${studentAttendanceRate}%`}
          metaLeft={`${studentStats?.PRESENT ?? 0} present`}
          metaRight={`${studentsTracked} tracked`}
          progress={studentAttendanceRate}
          icon={GraduationCap}
          accent="bg-gradient-to-r from-violet-400 to-violet-500"
        />
        <StatCard
          title="Teacher Attendance"
          value={`${teacherAttendanceRate}%`}
          metaLeft={`${teacherStats?.PRESENT ?? 0} present`}
          metaRight={`${teachersTracked} tracked`}
          progress={teacherAttendanceRate}
          icon={Users}
          accent="bg-gradient-to-r from-emerald-400 to-emerald-500"
        />
        <StatCard
          title="Class Coverage"
          value={`${classCoverage}%`}
          metaLeft={`${classesMarked} marked`}
          metaRight={`${pendingClasses} pending`}
          progress={classCoverage}
          icon={BookCopy}
          accent="bg-gradient-to-r from-sky-400 to-sky-500"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <DailyAttendanceChart />

        <div className="grid gap-6">
          <Card className="border-border/60 ">
            <CardHeader>
              <CardTitle className="text-lg">Finance Overview</CardTitle>
              <CardDescription>
                Collection and due status from the current fee records.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pb-6">
              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Collection Rate</span>
                  <span className="font-medium">{collectionRate}%</span>
                </div>
                <Progress
                  value={collectionRate}
                  className="mt-3 h-2 bg-secondary/70"
                  indicatorClassName="bg-gradient-to-r from-emerald-400 to-emerald-500"
                />
              </div>

              <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Due Share</span>
                  <span className="font-medium">{dueRate}%</span>
                </div>
                <Progress
                  value={dueRate}
                  className="mt-3 h-2 bg-secondary/70"
                  indicatorClassName="bg-gradient-to-r from-amber-400 to-orange-500"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-sm text-muted-foreground">Overdue students</p>
                  <p className="mt-2 text-2xl font-semibold">{finance?.overdueStudents ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <p className="text-sm text-muted-foreground">Latest payment</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {latestPayment ? `₹${currency(latestPayment.amount)}` : "--"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {latestPayment
                      ? `${latestPayment.studentName} on ${formatShortDate(latestPayment.paymentDate)}`
                      : "No recent payment"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60 ">
            <CardHeader>
              <CardTitle className="text-lg">Recent Payments</CardTitle>
              <CardDescription>Latest fee payments recorded in the system.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 pb-6">
              {recentPayments.length ? (
                recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{payment.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {payment.method} • {formatShortDate(payment.paymentDate)}
                      </p>
                    </div>
                    <Badge variant="outline">₹{currency(payment.amount)}</Badge>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border/60 px-4 py-6 text-sm text-muted-foreground">
                  No recent payments found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Classes With Highest Due</CardTitle>
          <CardDescription>
            Classes that may need quicker collection follow-up.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 pb-6 md:grid-cols-2">
          {topDueClasses.length ? (
            topDueClasses.map((item) => {
              const paidShare = percentage(item.paid, item.total);
              return (
                <div key={item.id} className="rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{item.className}</p>
                      <p className="text-xs text-muted-foreground">
                        Due ₹{currency(item.due)} of ₹{currency(item.total)}
                      </p>
                    </div>
                    <Badge variant="outline">{paidShare}% paid</Badge>
                  </div>
                  <Progress
                    value={paidShare}
                    className="mt-4 h-2 bg-secondary/70"
                    indicatorClassName="bg-gradient-to-r from-amber-400 to-orange-500"
                  />
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 px-4 py-6 text-sm text-muted-foreground md:col-span-2">
              Fee data is not available yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalystics;
