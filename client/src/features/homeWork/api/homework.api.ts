import api from "@/api/axios";

export const createHomework = async (data: any) => {
  const res = await api.post("/homework", data);
  return res.data;
};

export const getHomeworkByClass = async (classId: string) => {
  const res = await api.get(`/homework/class/${classId}`);
  return res.data;
};

export const updateHomeworkStatus = async (
  homeworkId: string,
  status: string
) => {
  const res = await api.patch(
    `/homework/${homeworkId}/status`,
    { status }
  );
  return res.data;
};

export const deleteHomework = async (homeworkId: string) => {
  const res = await api.delete(`/homework/${homeworkId}`);
  return res.data;
};