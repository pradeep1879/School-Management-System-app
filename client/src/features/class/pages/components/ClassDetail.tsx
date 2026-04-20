import { useAuthStore } from "@/store/auth.store";
import { useParams } from "react-router-dom";
import { useTeacherClass } from "../../hooks/useTeacherClass";
import { useClassDetail } from "../../hooks/useClassDetail";
import ClassDetailHeader from "../../components/ClassDetailHeader";
import { useState } from "react";
import StudentsTable from "@/features/student/components/table/StudentTable";
import ActivitiesSection from "@/features/activity/pages/ClassActivityPage";
import SubjectsSection from "@/features/subject/components/SubjectsSection";
import ExamPage from "@/features/exam/pages/ExamPage";
import ClassAttendanceOverview from "@/features/attendance/components/ClassAttendanceOverview";

import ExamAnalyticsDashboard from "@/features/exam/analytics/ExamAnalyticsDashboard";
import { ClassDetailHeaderSkeleton } from "../../skeletons/ClassDetailHeaderSkeleton";

const tabs = [
  { id: "students", label: "Students" },
  { id: "attendance", label: "Attendance" },
  { id: "subjects", label: "Subjects" },
  { id: "exams", label: "Exams" },
  { id: "analytics", label: "Analytics" },
  { id: "activities", label: "Activities" },
];

const ClassDetail = () => {
  const [activeTab, setActiveTab] = useState("students");
  const role = useAuthStore((state) => state.role);
  const { classId } = useParams();
  
  // Teacher class
  const teacherQuery = useTeacherClass(role === "teacher");
  // Admin class
  const adminQuery = useClassDetail(classId, role === "admin");
  
  let data;
  let isLoading;
  
  if (role === "teacher") {
    data = teacherQuery.data;
    isLoading = teacherQuery.isLoading;
  } else if (role === "admin") {
    data = adminQuery.data;
    isLoading = adminQuery.isLoading;
  }
  
  
  const classData = data?.classDetail;
  console.log("ClassDetail", classData)


  if (isLoading) {
    return (
      <div className="space-y-4">
       <ClassDetailHeaderSkeleton/>
      </div>
    );
  }

  if (!classData) {
    return <p>Class not foundsd</p>;
  }

  return (
    <div>
      <ClassDetailHeader
          classId={classData.id}
          students={classData.students}
          className={`Class ${classData.slug}`}
          section={classData.section}
          classTeacher={classData.teacher?.teacherName || "Not Assigned"}
          totalStudents={classData._count?.students || 0}
          totalSubjects={classData._count?.subjects || 0}
          attendance={92}
          academicYear={classData.session}
        />


      {role === "teacher" && (
        <div className="mt-6">
          <ExamAnalyticsDashboard classId={classData.id} />
        </div>
      )}


        {role === "admin" && (
        <div className="mt-8">
          <div className="custom-div-scroll flex gap-6 border-b overflow-x-auto whitespace-nowrap pb-1 lg:gap-10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 pb-3 text-base font-medium relative sm:text-sm md:text-base lg:text-lg ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute left-0 bottom-0 h-0.5 w-full bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "analytics" && (
              <ExamAnalyticsDashboard classId={classData.id} />
            )}
            {activeTab === "students" && <StudentsTable classId={classData?.id} profileBasePath={`/${role}`}/>}
            {activeTab === "subjects" && <SubjectsSection classId={classData.id} canEdit />}
            {activeTab === "activities" && <ActivitiesSection classId={classData?.id} canEdit />}
            {activeTab === "exams" && <ExamPage />}
            {activeTab === "attendance" && (
                <ClassAttendanceOverview classId={classData.id} />
            )}
            {/* {activeTab === "result" && <ClassResultsSection />} */}
            {/* {activeTab === "collect-fee" && <CollectFeeSection />} */}
          </div>
        </div>
        )}      
    </div>
  );
};

export default ClassDetail;
