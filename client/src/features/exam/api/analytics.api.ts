import api from "@/api/axios";


export const getExamAnalytics = async (examId: string) => {
  const res = await api.get(`/exam/analytics/exam/${examId}`);
  return res.data;
};