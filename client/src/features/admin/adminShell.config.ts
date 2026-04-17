import {
  Banknote,
  BookOpenCheckIcon,
  Calendar1Icon,
  CalendarDays,
  HandCoins,
  LayoutDashboardIcon,
  Megaphone,
  School2,
  Settings,
  Settings2,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";

import type {
  ShellBrand,
  ShellCommandItem,
  ShellNavSection,
  ShellPageMatcher,
} from "@/components/layout/shell.types";

export const adminShellBrand: ShellBrand = {
  title: "Admin Panel",
  subtitle: "School ERP",
  homeUrl: "/admin/dashboard",
  icon: ShieldCheck,
  iconClassName: "bg-linear-to-br from-blue-500 via-violet-500 to-fuchsia-500",
};

export const adminShellSections: ShellNavSection[] = [
  {
    label: "Application",
    items: [
      { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboardIcon },
      { title: "Teachers", url: "/admin/teachers", icon: Users },
      { title: "Classes", url: "/admin/classes", icon: School2 },
      { title: "Students", url: "/admin/students", icon: User },
      { title: "Announcements", url: "/admin/announcements", icon: Megaphone },
      { title: "Time Table", url: "/admin/time-table", icon: CalendarDays },
      { title: "Calendar", url: "/admin/calendar", icon: Calendar1Icon },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Finance Dashboard", url: "/admin/finance/dashboard", icon: BookOpenCheckIcon },
      { title: "Collect Fee", url: "/admin/finance/collect", icon: HandCoins },
      { title: "Salary", url: "/admin/finance/salary", icon: Banknote },
      { title: "Finance Setup", url: "/admin/finance/setup", icon: Settings2 },
    ],
  },
  {
    label: "Account",
    items: [{ title: "Settings", url: "/admin/setting", icon: Settings }],
  },
];

export const adminShellTitles: ShellPageMatcher[] = [
  { prefix: "/admin/teacher-profile/", title: "Teacher Profile" },
  { prefix: "/admin/class-detail/", title: "Class Details" },
  { prefix: "/admin/student-profile/", title: "Student Profile" },
  { prefix: "/admin/exam/", title: "Exam Results" },
  { prefix: "/admin/teacher/attendance/", title: "Teacher Attendance" },
];

export const adminCommandExtras: ShellCommandItem[] = [
  { title: "Open Admin Settings", url: "/admin/setting", section: "Quick Action", keywords: ["profile", "account"] },
  { title: "Review Salary", url: "/admin/finance/salary", section: "Quick Action", keywords: ["payroll", "finance"] },
];
