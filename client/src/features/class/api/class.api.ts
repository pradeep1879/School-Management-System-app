import api from "@/api/axios";

export const createClass = async (data: {
  slug: string;
  section?: string;
  session?: string;
}) => {
  const res = await api.post("/classes", data);
  return res.data;
};

export const updateClass = async (data: {
  slug?: string;
  section?: string;
  session?: string;
}, classId: string) => {
  const res = await api.patch(`/classes/${classId}`, data);
  return res.data;
}

export const deleteClass = async (classId: string) => {
  const res = await api.delete(`/classes/${classId}`)
  return res.data;
}

export const getAllClasses = (params?: {
  page?: number;
  limit?: number;
}) => {
  return api.get("/classes", { params });
};

export const getClassDropdown = async () => {
  const res = await api.get("/classes/dropdown");
  return res.data;
};


// Admin class detail
export const getClassById = async (id: string) => {
  const res = await api.get(`/classes/${id}`);
  return res.data;
};

// Teacher assigned class
export const getTeacherClass = async () => {
  const res = await api.get("/teacher/class");
  return res.data;
};