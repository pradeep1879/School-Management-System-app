  import { useAuthStore } from "@/store/auth.store";
  import { useParams } from "react-router-dom";
  import { useClassDetail } from "./useClassDetail";
  import { useTeacherClass } from "./useTeacherClass";
  import { useStudentClass } from "@/features/student/hooks/useStudent";


  export const useCurrentClass = () => {
    const role = useAuthStore((state) => state.role);
    const { classId: paramClassId } = useParams();

    //  Admin → class comes from URL param
    const adminQuery = useClassDetail(
      paramClassId!,
      role === "admin" && !!paramClassId
    );

    //  Teacher → assigned class
    const teacherQuery = useTeacherClass(
      role === "teacher"
    );

    //  Student → own class
    const studentQuery = useStudentClass(
      role === "student"
    );

    let classId: string | undefined;
    let isLoading = false;
    let data: any;

    if (role === "admin") {
      classId = adminQuery.data?.classDetail?.id;
      isLoading = adminQuery.isLoading;
      data = adminQuery.data;
    }

    if (role === "teacher") {
      classId = teacherQuery.data?.classDetail?.id;
      isLoading = teacherQuery.isLoading;
      data = teacherQuery.data;
    }

    if (role === "student") {
      classId = studentQuery.data?.classDetail?.id; // 
      isLoading = studentQuery.isLoading;
      data = studentQuery.data; 
    }

    return {
      classId,
      data,
      isLoading,
      role,
    };
  };