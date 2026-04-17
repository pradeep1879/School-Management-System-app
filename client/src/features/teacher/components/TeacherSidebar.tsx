import { useNavigate } from "react-router-dom";

import { AppShellSidebar } from "@/components/layout/AppShellSidebar";
import {
  getTeacherShellSections,
  teacherShellBrand,
} from "@/features/teacher/teacherShell.config";
import { useAuthStore } from "@/store/auth.store";
import { useTeacherClass } from "@/features/class/hooks/useTeacherClass";
import { teacherLogout } from "../api/teacher.api";

const TeacherSidebar = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);
  const { data } = useTeacherClass(true);
  const classId = data?.classDetail?.id;

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
    <AppShellSidebar
      brand={teacherShellBrand}
      sections={getTeacherShellSections(classId)}
      onLogout={handleLogout}
    />
  );
};

export default TeacherSidebar;
