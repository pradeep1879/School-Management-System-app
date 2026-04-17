import { useNavigate } from "react-router-dom";

import { AppShellSidebar } from "@/components/layout/AppShellSidebar";
import {
  getStudentShellSections,
  studentShellBrand,
} from "@/features/student/studentShell.config";
import { useNotificationContext } from "@/features/notification/context/NotificationContext";
import { useAuthStore } from "@/store/auth.store";
import { studentLogout } from "../api/student.api";

const StudentSidebar = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);
  const { notification } = useNotificationContext();

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
      sections={getStudentShellSections(notification?.length ?? 0)}
      onLogout={handleLogout}
    />
  );
};

export default StudentSidebar;
