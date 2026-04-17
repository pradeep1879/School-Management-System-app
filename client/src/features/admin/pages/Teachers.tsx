import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AddTeacher from "../components/AddTeacher";
import { useState } from "react";

import TeachersTable from "../components/TeachersList";
import PendingAttendanceTable from "@/features/teacherAttendance/components/PendingAttendanceTable";
import TeacherAttendanceHistoryStatsTable from "@/features/teacherAttendance/components/AttendanceHistoryTable";

const tabs = [
  { id: "all-teachers", label: "All Teachers" },
  { id: "attendance", label: "Attendance Queue" },
  { id: "attendance-history", label: "Attendance History" },
];




const Teachers = () => {
  const [activeTab, setActiveTab] = useState("all-teachers");
  const [open, setOpen] = useState(false);


  return (
    <div className="space-y-10">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            Teachers Management
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor teachers, attendance, salary and leave requests
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Add Teacher
            </Button>
          </DialogTrigger>
          <AddTeacher setOpen={setOpen}/>
        </Dialog>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-6  md:gap-8 border-b custom-div-scroll">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-medium transition-all relative ${
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute left-0 bottom-0 h-0.5 w-full bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* ================= CONTENT ================= */}
    


      {activeTab === "all-teachers" && (
       <TeachersTable  limit={10} />
      )}

      {activeTab === "attendance" && (
        <div className="space-y-6">
          <PendingAttendanceTable/>
        </div>
      )}

      {activeTab === "attendance-history" && (
        <div className="">
          <TeacherAttendanceHistoryStatsTable/>
        </div>
      )}
    
    </div>
  );
};

export default Teachers;
