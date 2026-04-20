import { useNavigate } from "react-router-dom";

import { AppShellSidebar } from "@/components/layout/AppShellSidebar";
import {
  getStudentShellSections,
  studentShellBrand,
} from "@/features/student/studentShell.config";

import { useAuthStore } from "@/store/auth.store";
import { studentLogout } from "../api/student.api";

const StudentSidebar = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);
  const sections = getStudentShellSections();

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
    <AppShellSidebar
      brand={studentShellBrand}
      sections={sections}
      onLogout={handleLogout}
    />
  );
};

export default StudentSidebar;
