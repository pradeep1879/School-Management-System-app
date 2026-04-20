import {
  BookCheck,
  BookOpen,
  Brain,
  Calendar1Icon,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  ReceiptIndianRupee,
  Settings,
} from "lucide-react";

import type {
  ShellBrand,
  ShellCommandItem,
  ShellNavSection,
  ShellPageMatcher,
} from "@/components/layout/shell.types";

export const studentShellBrand: ShellBrand = {
  title: "Student Panel",
  subtitle: "Learning ERP",
  homeUrl: "/student/dashboard",
  icon: GraduationCap,
  iconClassName: "bg-linear-to-br from-violet-500 via-fuchsia-500 to-pink-500",
};

export const getStudentShellSections = (
): ShellNavSection[] => [
  {
    label: "Application",
    items: [
      { title: "Dashboard", url: "/student/dashboard", icon: LayoutDashboard },
      { title: "Subjects", url: "/student/subjects", icon: BookOpen },
      { title: "Attendance", url: "/student/attendance", icon: CalendarCheck },
      { title: "Activities", url: "/student/activities", icon: ClipboardList },
      { title: "Homework", url: "/student/homework", icon: BookCheck },
      { title: "Exams", url: "/student/exams", icon: GraduationCap },
      { title: "AI Quiz", url: "/student/ai-quiz", icon: Brain },
      { title: "Announcements", url: "/student/announcements", icon: Megaphone },
      { title: "Time Table", url: "/student/time-table", icon: CalendarDays },
      { title: "Calendar", url: "/student/calendar", icon: Calendar1Icon },
      
      { title: "Fee", url: "/student/fee", icon: ReceiptIndianRupee },
    ],
  },
  {
    label: "Account",
    items: [{ title: "Settings", url: "/student/setting", icon: Settings }],
  },
];

export const studentShellTitles: ShellPageMatcher[] = [
  { prefix: "/student/subjects/", title: "Syllabus" },
  { prefix: "/student/ai-quiz/attempt/", title: "AI Quiz Attempt" },
  { prefix: "/student/ai-quiz/result/", title: "AI Quiz Result" },
  { prefix: "/student/exam/", title: "Exam Result" },
];

export const studentCommandExtras: ShellCommandItem[] = [
  { title: "Start AI Quiz", url: "/student/ai-quiz", section: "Quick Action", keywords: ["quiz", "practice", "ai"] },
  { title: "Open Student Settings", url: "/student/setting", section: "Quick Action", keywords: ["profile", "account"] },
];
