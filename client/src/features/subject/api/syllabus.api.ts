import api from "@/api/axios";

export const createSyllabus = async (data: any) => {
  return api.post("/syllabus/bulk", data);
};

export const getSyllabus = async (subjectId: string) => {
  return api.get(`/syllabus/subject/${subjectId}`);
};