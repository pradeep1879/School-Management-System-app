import api from "@/api/axios";

// Admin
export const createTeacher = async (data: FormData) => {
  const res = await api.post("/teacher", data);
  return res.data;
};

export const teacherLogin = async (data: {
  email?: string;
  password: string;
}) => {
  const res = await api.post("/teacher/login", data);
  return res.data;
};

export const teacherLogout = async () => {
  const res = await api.post("/teacher/logout");
  return res.data;
};


export const getAllTeachers = async (params: {
  page?: number;
  limit?: number;
}) => {
  const res = await api.get("/teacher", { params });
  return res.data;
};

export const getTeacherById = async (id: string) => {
  const res = await api.get(`/teacher/${id}`);
  return res.data;
};

// Teacher
export const getTeacherProfile = async () => {
  const res = await api.get("/teacher/profile");
  return res.data;
};

export const updateTeacherProfile = (data: {
  email?: string
  oldPasswrod?: string;
  password?: string
  confirmPassword?: string
}) => {
  return api.patch("/teacher/profile", data)
}