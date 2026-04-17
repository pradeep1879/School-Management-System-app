import { useNavigate } from "react-router-dom";

import { AppShellSidebar } from "@/components/layout/AppShellSidebar";
import { adminShellBrand, adminShellSections } from "@/features/admin/adminShell.config";
import { useAuthStore } from "@/store/auth.store";
import { adminLogout } from "../api/admin.api";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await adminLogout();
      logoutStore();
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AppShellSidebar
      brand={adminShellBrand}
      sections={adminShellSections}
      onLogout={handleLogout}
    />
  );
};

export default AdminSidebar;
