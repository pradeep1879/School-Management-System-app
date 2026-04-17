// import api from "@/api/axios";

// // Overview
// export const getExamResultsOverview = async (examId: string) => {
//   const res = await api.get(`/exam/${examId}/results`);
//   return res.data;
// };

// // Detailed Student Report
// export const getStudentDetailedResult = async (
//   examId: string,
//   studentId: string
// ) => {
//   const res = await api.get(
//     `/exam/${examId}/result/${studentId}`
//   );
//   return res.data;
// };












import api from "@/api/axios";

export const getExamResultsOverview = async (examId: string) => {
  const res = await api.get(`/exam/${examId}/results`);
  return res.data;
};

export const getStudentDetailedResult = async (
  examId: string,
  studentId: string
) => {
  const res = await api.get(
    `/exam/${examId}/result/${studentId}`
  );
  return res.data;
};