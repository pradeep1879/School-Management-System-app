import {
  BookOpen,
  Calendar1Icon,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  LayoutDashboardIcon,
  Megaphone,
  School2,
  Settings,
  User,
} from "lucide-react";

import type {
  ShellBrand,
  ShellCommandItem,
  ShellNavSection,
  ShellPageMatcher,
} from "@/components/layout/shell.types";

export const teacherShellBrand: ShellBrand = {
  title: "Teacher Panel",
  subtitle: "Class ERP",
  homeUrl: "/teacher/dashboard",
  icon: BookOpen,
  iconClassName: "bg-linear-to-br from-sky-500 via-cyan-500 to-emerald-500",
};

export const getTeacherShellSections = (classId?: string): ShellNavSection[] => [
  {
    label: "Application",
    items: [
      { title: "Dashboard", url: "/teacher/dashboard", icon: LayoutDashboardIcon },
      { title: "My Attendance", url: "/teacher/my-attendance", icon: CalendarCheck },
      { title: "Announcements", url: "/teacher/announcements", icon: Megaphone },
      { title: "Time Table", url: "/teacher/time-table", icon: CalendarDays },
      { title: "Calendar", url: "/teacher/calendar", icon: Calendar1Icon },
      ...(classId
        ? [
            {
              title: "Your Class",
              url: `/teacher/class-detail/${classId}`,
              icon: School2,
            },
            { title: "Students", url: "/teacher/class/students", icon: User },
            { title: "Attendance", url: "/teacher/attendance", icon: CalendarCheck },
            { title: "Subjects", url: "/teacher/class/subjects", icon: BookOpen },
            { title: "Activities", url: "/teacher/class/activities", icon: ClipboardList },
            { title: "Exams", url: "/teacher/class/exams", icon: GraduationCap },
            { title: "HomeWork", url: "/teacher/class/homework", icon: GraduationCap },
          ]
        : []),
    ],
  },
  {
    label: "Account",
    items: [{ title: "Settings", url: "/teacher/setting", icon: Settings }],
  },
];

export const teacherShellTitles: ShellPageMatcher[] = [
  { prefix: "/teacher/class-detail/", title: "Class Details" },
  { prefix: "/teacher/attendance/student/", title: "Student Attendance" },
  { prefix: "/teacher/my-attendance", title: "My Attendance" },
  { prefix: "/teacher/exam/", title: "Exam Workspace" },
  { prefix: "/teacher/student-profile/", title: "Student Profile" },
  { prefix: "/teacher/subjects/", title: "Syllabus" },
  { prefix: "/teacher/teacher/attendance/", title: "Attendance Stats" },
];

export const getTeacherCommandExtras = (classId?: string): ShellCommandItem[] => [
  { title: "Open Teacher Settings", url: "/teacher/setting", section: "Quick Action", keywords: ["profile", "account"] },
  ...(classId
    ? [{ title: "Review Students", url: "/teacher/class/students", section: "Quick Action", keywords: ["class", "roster"] }]
    : []),
];
