import { useNavigate } from "react-router-dom";

import { AppShellNavbar } from "@/components/layout/AppShellNavbar";
import { buildCommandItems } from "@/components/layout/shell.utils";
import {
  getTeacherShellSections,
  teacherCommandExtras,
  teacherShellTitles,
} from "@/features/teacher/teacherShell.config";
import { useAuthStore } from "@/store/auth.store";
import { teacherLogout } from "../api/teacher.api";
import { useTeacherProfile } from "../hooks/useTeacherProfile";
import { useTeacherClass } from "@/features/class/hooks/useTeacherClass";

const getInitials = (name?: string) =>
  name
    ?.split(" ")
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("") ?? "T";

const TeacherNavbar = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);
  const { data, isLoading } = useTeacherProfile();
  const { data: classData } = useTeacherClass(true);
  const teacher = data?.teacher;
  const classId = classData?.classDetail?.id;
  const sections = getTeacherShellSections(classId);

  const handleLogout = async () => {
    try {
      await teacherLogout();
      logoutStore();
      navigate("/teacher/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AppShellNavbar
      sections={sections}
      extraTitles={teacherShellTitles}
      commandItems={buildCommandItems(sections, teacherCommandExtras)}
      user={{
        name: teacher?.teacherName,
        email: teacher?.email,
        roleLabel: "Teacher",
        imageUrl: teacher?.imageUrl,
        initials: getInitials(teacher?.teacherName),
      }}
      loading={isLoading}
      profileHref="/teacher/setting"
      settingsHref="/teacher/setting"
      onLogout={handleLogout}
    />
  );
};

export default TeacherNavbar;
