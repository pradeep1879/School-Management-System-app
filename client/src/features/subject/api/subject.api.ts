import api from "@/api/axios";

// Create
export const createSubject = async (data: any) => {
  const res = await api.post("/subject", data);
  return res.data;
};

// Update
export const updateSubject = async (id: string, data: any) => {
  const res = await api.patch(`/subject/${id}`, data);
  return res.data;
};

// Get by class
export const getSubjectsByClass = async (classId: string) => {
  const res = await api.get("/subject", {
    params: { classId },
  });
  return res.data;
};