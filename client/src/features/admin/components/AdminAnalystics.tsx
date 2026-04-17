import { GraduationCap, School, Users } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import AttendenceReportChart from "./AttendenceReport";
import DashboardTopCard from "./DashboardCard";
import { useDashboardAnalytics } from "../hooks/useAdminDashboard";
import DailyAttendanceChart from "./dashboardAnalytics/AttendaceBarGraph";

const AdminAnalystics = () => {
  const { data } = useDashboardAnalytics();
  console.log("adminanalytics", data);

  const presentStudents = data?.todayAttendance?.students?.PRESENT || 0;
  const presentTeachers = data?.todayAttendance?.teachers?.PRESENT || 0;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <DashboardTopCard
          title="Total Classes"
          value={data?.overview?.totalClasses}
          icon={School}
          color="border-blue-500 text-blue-500"
        />

        <DashboardTopCard
          title="Teachers"
          value={data?.overview?.totalTeachers}
          icon={Users}
          color="border-green-500 text-green-500"
          present={presentTeachers}
          absent={data?.todayAttendance?.teachers?.ABSENT}
          leave={data?.todayAttendance?.teachers?.LEAVE}
        />

        <DashboardTopCard
          title="Students"
          value={data?.overview?.totalStudents}
          icon={GraduationCap}
          color="border-purple-300 text-purple-500"
          present={presentStudents}
          absent={data?.todayAttendance?.students?.ABSENT}
          leave={data?.todayAttendance?.students?.LEAVE}
          holiday={data?.todayAttendance?.students?.HOLIDAY}
        />
      </div>

      {/*  GRAPH SECTION  */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <DailyAttendanceChart />
        </div>

        <div className="xl:col-span-1">
          <AttendenceReportChart />
        </div>
      </div>

      {/*  RECENT ACTIVITY */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>

        {/* <CardContent>
          <div className="space-y-4">
            {recentActivities?.map((activity: any) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b pb-3 last:border-none"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-medium">
                    {activity.type?.[0]?.toUpperCase()}
                  </div>

                  <div>
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent> */}
      </Card>
    </div>
  );
};

export default AdminAnalystics;
