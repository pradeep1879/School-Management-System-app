import api from "@/api/axios";

export const createStudent = (data: FormData) => {
  return api.post("/students", data);
};

export const studentLogout = async () => {
  const res = await api.post("/students/logout");
  return res.data;
};


export interface StudentLoginPayload {
  userName: string;
  password: string;
}

export const loginStudent = (data: StudentLoginPayload) => {
  return api.post("/students/login", data);
};

export const getStudentsByClass = (
  classId: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
  }
) => {
  return api.get(`/students/class/${classId}`, { params });
};


export const getStudentById = (studentId: string) => {
  return api.get(`/students/${studentId}`);
};

export const getMyStudentProfile = () => {
  return api.get("/students/profile")
}

export const updateStudentProfile = (data: {
  userName?: string
  password?: string
  confirmPassword?: string
}) => {
  return api.patch("/students/profile", data)
}