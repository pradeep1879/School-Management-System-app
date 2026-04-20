import AdminLogin from '@/features/admin/pages/auth/AdminLogin'

import SchoolCalendar from '@/features/admin/pages/Calendar';

import Classes from '@/features/admin/pages/Classes';
import AdminDashboard from '@/features/admin/pages/Dashboard';
import StudentsPage from '@/features/student/pages/StudentsPage';
// import SubjectsPage from '@/features/admin/pages/Subjects';
import TeacherProfilePage from '@/features/admin/pages/TeacherProfilePage';
import Teachers from '@/features/admin/pages/Teachers';
import SchoolDailySchedulePage from '@/features/admin/pages/TimeTable';


import TeacherLogin from '@/features/teacher/pages/auth/TeacherLogin';
import TeacherDashboard from '@/features/teacher/pages/Dashboard';
import TeacherCalendarPage from '@/features/teacher/pages/TeacherCalendarPage';
import TeacherTimetablePage from '@/features/teacher/pages/TeacherTimetablePage';


import AdminLayout from '@/layouts/AdminLayout';
import TeacherLayout from '@/layouts/TeacherLayout';
import { Routes, Route } from 'react-router-dom'
import ClassDetail from '@/features/class/pages/components/ClassDetail';
import ProtectedRoute from './ProtectedRoutes';
import ExamMarksPage from '@/features/exam/pages/ExamMarksPage';
import ExamDetailPage from '@/features/exam/pages/ExamDetailPage';


import ExamPage from '@/features/exam/pages/ExamPage';
import ClassResultsSection from '@/features/class/components/ClassResults';

// import ExamResultsPage from '@/features/exam/pages/result/ExamResultsPage';
import StudentResultPage from '@/features/exam/pages/result/StudentResultPage';

import StudentLogin from '@/features/student/pages/auth/StudentLogin';
import StudentLayout from '@/layouts/StudentLayout';
import StudentDashboard from '@/features/student/pages/StudentDashboard';
import TeacherActivityPage from '@/features/teacher/pages/TeacherActivityPage';
import StudentActivityPage from '@/features/student/pages/StudentActivityPage';
import TeacherSubjectsPage from '@/features/teacher/pages/TeacherSubjectsPage';
import StudentSubjectsPage from '@/features/student/pages/StudentSubjectsPage';

import StudentExamListPage from '@/features/student/pages/StudentExamListPage';
import HomeworkPage from '@/features/homeWork/pages/HomeworkPage';
import SyllabusPage from '@/features/subject/pages/SyllabusPage';

import TeacherStudentResultsPage from '@/features/exam/pages/result/TeacherStudentResultPage';
import AdminStudentResultsPage from '@/features/exam/pages/result/AdminStudentResultsPage';
import TeacherAttendancePage from '@/features/teacher/pages/TeacherAttendancePage';
import StudentAttendancePage from '@/features/student/pages/StudentAttendancePage';
import CollectFeePage from '@/finance/fee/pages/CollectFeePage';
import AdminFeeDashboard from '@/finance/fee/pages/AdminFeeDashboard';
import AdminFeeSetupPage from '@/finance/fee/pages/AdminFeeSetupPage';
import StudentProfileSettings from '@/features/student/pages/StudentProfileSettings';

import TeacherStudentsPage from '@/features/teacher/pages/TeacherStudentPage';
import StudentProfilePageAdminTeacher from '@/features/student/pages/StudentProfileForAdmin&Teacher';
import MyFeePage from '@/finance/fee/pages/StudentFeePage';


import TeacherAttendanceStatsPageFT from '@/features/teacherAttendance/pages/TeacherAttendanceStatsPageFT';
import AdminSalaryPage from '@/finance/salary/pages/AdminSalaryPage';
import PublicRoute from './PublicRoutes';
import NotFound from '@/components/extra-components/PageNotFound';

import TeacherProfileSetting from '@/features/teacher/pages/auth/TeacherProfileSetting';
import AdminProfileSetting from '@/features/admin/pages/auth/AdminProfileSetting';
import AnnouncementsPage from '@/features/announcements/pages/AnnouncementsPage';
import AIQuizDashboardPage from '@/features/student/ai-quiz/pages/AIQuizDashboardPage';
import AIQuizAttemptPage from '@/features/student/ai-quiz/pages/AIQuizAttemptPage';
import AIQuizResultPage from '@/features/student/ai-quiz/pages/AIQuizResultPage';
import StudentAttendanceProfilePage from '@/features/attendance/pages/StudentAttendanceProfilePage';




// import ClassActivitiesSection from '@/features/class/components/ClassActivities';

const AppRoutes = () =>{
  return (
    <Routes>
      {/* Admin */}
        <Route path="*" element={<NotFound />} />
        <Route path="/" element={<PublicRoute><AdminLogin/></PublicRoute>}/>
        <Route path="/admin/login" element={<PublicRoute><AdminLogin/></PublicRoute>}/>
        <Route path="/teacher/login" element={<PublicRoute><TeacherLogin/></PublicRoute>}/>
        <Route path="/student/login" element={<PublicRoute><StudentLogin/></PublicRoute>}/>



       <Route path="/admin" 
            element={<ProtectedRoute allowedRoles={["admin"]}><AdminLayout /></ProtectedRoute>}>
          
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="teachers" element={<Teachers />} />
        {/* <Route path="subjects" element={<SubjectsPage />} /> */}
        <Route path="teacher-profile/:id" element={<TeacherProfilePage />} />
        <Route path="classes" element={<Classes />} />
        <Route path="class-detail/:classId" element={<ClassDetail />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="student-profile/:studentId" element={<StudentProfilePageAdminTeacher />} />
        <Route path="attendance/student/:studentId" element={<StudentAttendanceProfilePage />} />
        <Route path="time-table" element={<SchoolDailySchedulePage />} />
        <Route path="exam/:examId/results" element={<AdminStudentResultsPage />} />
        <Route path="exam/:examId/result/:studentId" element={<StudentResultPage />} />
        <Route path="calendar" element={<SchoolCalendar />} />

         {/* <Route path="teacher/attendance" element={<AdminTeacherAttendancePage />}/> */}

          <Route path="teacher/attendance/:teacherId" element={<TeacherAttendanceStatsPageFT />}/>

          <Route path="/admin/finance/salary" element={<AdminSalaryPage />} />


        {/* <Route path="collect-fee" element={<CollectFeePage />} /> */}
        {/* <Route path="finance" element={<AdminFeeDashboard />} />
        <Route path="finance/collect" element={<CollectFeePage />} />
        <Route path="finance/setup" element={<AdminFeeSetupPage />} /> */}
        <Route path="finance/dashboard" element={<AdminFeeDashboard />} />
        <Route path="finance/collect" element={<CollectFeePage />} />
        <Route path="finance/setup" element={<AdminFeeSetupPage />} />
        <Route path="setting" element={<AdminProfileSetting />} />
       </Route>

        {/* <Route path="classes" element={<Classes />} />  */}



    <Route  path="/teacher" 
        element={<ProtectedRoute allowedRoles={["teacher"]}><TeacherLayout /></ProtectedRoute>}>

        {/* ================= DASHBOARD ================= */}
        <Route path="dashboard" element={<TeacherDashboard />} />

        {/* ================= CLASS CORE ================= */}
        <Route path="class-detail/:classId" element={<ClassDetail />} />
        <Route path="class/students" element={<TeacherStudentsPage />} />
        <Route path="class/subjects" element={<TeacherSubjectsPage />} />
        <Route path="class/activities" element={<TeacherActivityPage />} />
        <Route path="attendance" element={<TeacherAttendancePage />}/>
        <Route path="my-attendance" element={<TeacherAttendanceStatsPageFT />}/>

        {/* Optional if you keep class-level results */}
        <Route path="class/results" element={<ClassResultsSection />} />

        <Route path="class/exams" element={<ExamPage />} />
        <Route path="exam/:examId" element={<ExamDetailPage />} />
        <Route path="exam/:examId/marks" element={<ExamMarksPage />} />
        <Route path="class/homework" element={<HomeworkPage />} />
        <Route path="announcements" element={<AnnouncementsPage />} />
        <Route path="exam/:examId/result/:studentId" element={<StudentResultPage />} />
        <Route path="student-profile/:studentId" element={<StudentProfilePageAdminTeacher />} />
        <Route path="attendance/student/:studentId" element={<StudentAttendanceProfilePage />} />
        <Route path="exam/:examId/results" element={<TeacherStudentResultsPage />} />
        <Route path="subjects/:subjectId/syllabus"  element={<SyllabusPage />}/>

        <Route path="teacher/attendance" element={<TeacherAttendanceStatsPageFT />}/>
        <Route path="teacher/attendance/:teacherId" element={<TeacherAttendanceStatsPageFT />}/>

        {/* ================= OTHERS ================= */}
        <Route path="time-table" element={<TeacherTimetablePage />} />
        <Route path="calendar" element={<TeacherCalendarPage />} />
        <Route path="setting" element={<TeacherProfileSetting />} />
      </Route>
          

        {/* STUDENTS ROUTES */}
        
      <Route  path="/student"
           element={<ProtectedRoute allowedRoles={["student"]}><StudentLayout /></ProtectedRoute>}>

           <Route path="dashboard" element={<StudentDashboard />} />
           <Route path="activities" element={<StudentActivityPage />} />
           <Route path="attendance" element={ <StudentAttendancePage />}/>
           <Route path="subjects" element={<StudentSubjectsPage />}/>
           <Route path="exams" element={<StudentExamListPage />} />
           <Route path="ai-quiz" element={<AIQuizDashboardPage />} />
           <Route path="ai-quiz/attempt/:quizId" element={<AIQuizAttemptPage />} />
           <Route path="ai-quiz/result/:quizId" element={<AIQuizResultPage />} />
           <Route path="homework" element={<HomeworkPage />} />
           <Route path="announcements" element={<AnnouncementsPage />}/>
           <Route path="exam/:examId" element={<StudentResultPage />} />
           <Route  path="subjects/:subjectId/syllabus"  element={<SyllabusPage />}/>
           <Route  path="calendar"  element={<SchoolCalendar />}/>
           <Route  path="time-table"  element={<SchoolDailySchedulePage />}/>
           <Route  path="fee"  element={<MyFeePage />}/>
           <Route  path="setting"  element={<StudentProfileSettings />}/>

          

          {/* <Route path="profile" element={<StudentProfilePage />} />

          <Route path="exams" element={<ExamPage />} />

          <Route path="results" element={<ExamResultsPage />} />

          <Route path="result/:examId" element={<StudentResultPage />} />

          <Route path="calendar" element={<SchoolCalendar />} />

          <Route path="time-table" element={<SchoolDailySchedulePage />} /> */} 
        </Route>


    </Routes>
  )
}


export default AppRoutes;
