// import ClassDetailHeader from "@/features/class/components/ClassDetailHeader";
// import ClassExamSection from "@/features/exam/pages/ExamPage";
// import ClassResultsSection from "@/features/class/components/ClassResults";
// import StudentsTable from "@/features/student/components/table/StudentTable";
// import ClassSubjects from "@/features/subject/components/ClassSubjects";
// import HomeworkTab from "../components/HomeWork";

// import { useState } from "react";
// import { useTeacherClass } from "@/features/class/hooks/useTeacherClass";
// import { Skeleton } from "@/components/ui/skeleton";

// const tabs = [
//   { id: "students", label: "Students" },
//   { id: "subjects", label: "Subjects" },
//   { id: "homework", label: "Home Work" },
//   { id: "activities", label: "Activities" },
//   { id: "exams", label: "Exams" },
//   { id: "result", label: "Result" },
// ];

// const TeacherClassDetail = () => {
//   const [activeTab, setActiveTab] = useState("students");

//   const { data, isLoading } = useTeacherClass(true);

//   const classData = data?.class;
//   const classId = classData?.id;

//   if (isLoading) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-40 w-full rounded-xl" />
//       </div>
//     );
//   }

//   if (!classData) {
//     return <p>Class not assigned</p>;
//   }

//   return (
//     <div>
//       <ClassDetailHeader
//         className={`Class ${classData.slug}`}
//         section={classData.section}
//         classTeacher={classData.teacher?.teacherName || "Not Assigned"}
//         totalStudents={classData._count?.students || 0}
//         totalSubjects={classData._count?.subjects || 0}
//         attendance={92}
//         academicYear={classData.session}
//       />

//       <div className="mt-8">
//         {/* Tabs */}
//         <div className="flex gap-3 mb-4 sm:gap-6 md:gap-8 border-b">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`pb-3 text-sm font-medium transition-all relative ${
//                 activeTab === tab.id
//                   ? "text-primary"
//                   : "text-muted-foreground hover:text-foreground"
//               }`}
//             >
//               {tab.label}
//               {activeTab === tab.id && (
//                 <span className="absolute left-0 bottom-0 h-0.5 w-full bg-primary rounded-full" />
//               )}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         {activeTab === "students" && (
//           <StudentsTable
//             classId={classId}
//             profileBasePath="/staff"
//           />
//         )}

//         {activeTab === "subjects" && (
//           <ClassSubjects />
//         )}

//         {activeTab === "homework" && (
//           <HomeworkTab />
//         )}

//         {activeTab === "activities" && (
//           <div className="text-muted-foreground py-10">
//             Activities section coming soon
//           </div>
//         )}

//         {activeTab === "exams" && (
//           <ClassExamSection />
//         )}

//         {activeTab === "result" && (
//           <ClassResultsSection />
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherClassDetail;