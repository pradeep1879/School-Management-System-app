import { useNavigate } from "react-router-dom";

import { AppShellNavbar } from "@/components/layout/AppShellNavbar";
import { buildCommandItems } from "@/components/layout/shell.utils";
import {
  adminCommandExtras,
  adminShellSections,
  adminShellTitles,
} from "@/features/admin/adminShell.config";
import { useAuthStore } from "@/store/auth.store";
import { adminLogout } from "../api/admin.api";
import { useAdminProfile } from "../hooks/useAdminProfile";

const getInitials = (name?: string) =>
  name
    ?.split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase())
    .join("") ?? "A";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const logoutStore = useAuthStore((state) => state.logout);
  const { data, isLoading } = useAdminProfile();
  const admin = data?.admin;

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
    <AppShellNavbar
      sections={adminShellSections}
      extraTitles={adminShellTitles}
      commandItems={buildCommandItems(adminShellSections, adminCommandExtras)}
      user={{
        name: admin?.name,
        email: admin?.email,
        roleLabel: "Admin",
        imageUrl: admin?.imageUrl,
        initials: getInitials(admin?.name),
      }}
      loading={isLoading}
      profileHref="/admin/setting"
      settingsHref="/admin/setting"
      onLogout={handleLogout}
    />
  );
};

export default AdminNavbar;
