import { useState } from "react";
import { Mail, Phone, Calendar, Briefcase, Pencil } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useTeacherById } from "@/features/teacher/hooks/useTeacherById";
import { Skeleton } from "@/components/ui/skeleton";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "schedule", label: "Schedule" },
  { id: "classes", label: "Classes" },
  { id: "attendance", label: "Attendance" },
  { id: "salary", label: "Salary" },
  { id: "leaves", label: "Leaves" },
];

export default function TeacherProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useTeacherById(id!);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Profile Header Skeleton */}
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <Skeleton className="h-24 w-24 rounded-full" />

              <div className="space-y-3">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-40" />

                <div className="flex gap-3 mt-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-32 rounded-full" />
                </div>

                <div className="flex flex-wrap gap-4 mt-4">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-36" />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Skeleton className="h-10 w-24 rounded-md" />
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>
          </div>
        </Card>

        {/* Tabs Skeleton */}
        <div className="flex gap-6">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>

        {/* Overview Card Skeleton */}
        <Card>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return <p>Failed to load teacher</p>;
  }

  const teacher = data?.teacher; // based on backend response

  return (
    <div className="space-y-8">
      {/* ================= PROFILE HEADER ================= */}
      <Card className="p-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          {/* LEFT SECTION */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
              <AvatarImage src={teacher?.imageUrl} />
              <AvatarFallback>{teacher?.teacherName?.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-semibold">
                {teacher?.teacherName}
              </h1>

              <p className="text-muted-foreground text-sm">
                {teacher?.experience}
              </p>

              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">Active</Badge>
                <Badge variant="outline">ID: {teacher?.id}</Badge>
              </div>

              {/* CONTACT INFO */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mt-3">
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  {teacher?.email}
                </div>

                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  {teacher?.contactNo}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  Joined {new Date(teacher?.joinedOn).getFullYear()}
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase size={14} />
                  {teacher?.experience}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="gap-2">
              <Pencil size={14} />
              Edit
            </Button>

            <Button variant="destructive">Deactivate</Button>
          </div>
        </div>
      </Card>

      {/* ================= TABS ================= */}
      <div className="custom-scrollbar overflow-x-auto border-b">
        <div className="flex min-w-max gap-4 sm:gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative shrink-0 pb-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}

              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TAB CONTENT ================= */}
      <div>
        {activeTab === "overview" && (
          <Card>
            <CardContent className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Assigned Classes
                </p>
                <p className="text-2xl font-semibold">10A, 9B</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-2xl font-semibold">85</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-semibold text-green-600">92%</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "schedule" && (
          <Card>
            <CardContent className="p-6">
              Teacher weekly schedule here...
            </CardContent>
          </Card>
        )}

        {activeTab === "classes" && (
          <Card>
            <CardContent className="p-6">
              Classes handled by teacher...
            </CardContent>
          </Card>
        )}

        {activeTab === "attendance" && (
          <Card>
            <CardContent className="p-6">
              Monthly attendance analytics...
            </CardContent>
          </Card>
        )}

        {activeTab === "salary" && (
          <Card>
            <CardContent className="p-6">
              Salary history & payments...
            </CardContent>
          </Card>
        )}

        {activeTab === "leaves" && (
          <Card>
            <CardContent className="p-6">
              Leave requests and approvals...
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
