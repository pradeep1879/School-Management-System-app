import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import AdminNavbar from "@/features/admin/components/AdminNavbar";
import AdminSidebar from "@/features/admin/components/AdminSidebar";


const AdminLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-clip bg-background">
        <AdminSidebar />

        <SidebarInset>
          <AdminNavbar />

          <main className="flex-1 min-w-0 overflow-x-clip px-3 py-4 sm:px-6 lg:px-8">
            <Outlet />   {/* child route renders here */}
          </main>

        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
