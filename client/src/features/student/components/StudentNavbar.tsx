import { useNavigate } from "react-router-dom";

import { AppShellNavbar } from "@/components/layout/AppShellNavbar";
import { buildCommandItems } from "@/components/layout/shell.utils";
import {
  getStudentShellSections,
  studentCommandExtras,
  studentShellTitles,
} from "@/features/student/studentShell.config";
import { useNotificationContext } from "@/features/notification/context/NotificationContext";
import { useAuthStore } from "@/store/auth.store";
import { studentLogout } from "../api/student.api";
import { useStudentProfile } from "../hooks/useStudentProfile";

const getInitials = (name?: string) =>
  name
    ?.split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .join("") ?? "S";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);
  const { notification } = useNotificationContext();
  const { data, isLoading } = useStudentProfile();
  const student = data?.student;
  const sections = getStudentShellSections(notification?.length ?? 0);

  const handleLogout = async () => {
    try {
      await studentLogout();
      logoutStore();
      navigate("/student/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AppShellNavbar
      sections={sections}
      extraTitles={studentShellTitles}
      commandItems={buildCommandItems(sections, studentCommandExtras)}
      user={{
        name: student?.studentName,
        email: student?.userName,
        roleLabel: "Student",
        imageUrl: student?.imageUrl,
        initials: getInitials(student?.studentName),
      }}
      loading={isLoading}
      profileHref="/student/setting"
      settingsHref="/student/setting"
      onLogout={handleLogout}
    />
  );
};

export default StudentNavbar;
