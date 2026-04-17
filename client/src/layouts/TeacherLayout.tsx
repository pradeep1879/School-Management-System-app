import { Outlet } from "react-router-dom";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import TeacherSidebar from "@/features/teacher/components/TeacherSidebar";
import TeacherNavbar from "@/features/teacher/components/TeacherNavbar";


const TeacherLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <TeacherSidebar />

        <SidebarInset>
          <TeacherNavbar />

          <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
            <Outlet />   {/* child route renders here */}
          </main>

        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default TeacherLayout;
