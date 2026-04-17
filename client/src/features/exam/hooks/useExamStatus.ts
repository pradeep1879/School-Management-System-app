// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import api from "@/api/axios";

// export const useUpdateExamStatus = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async ({
//       examId,
//       status,
//     }: {
//       examId: string;
//       status: string;
//     }) => {
//       const res = await api.patch(`/exam/${examId}/status`, {
//         status,
//       });
//       return res.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["exams"] });
//     },
//   });
// };

// // export const usePublishExam = () => {
// //   const queryClient = useQueryClient();

// //   return useMutation({
// //     mutationFn: async (examId: string) => {
// //       const res = await api.patch(`/exam/${examId}/publish`);
// //       return res.data;
// //     },
// //     onSuccess: () => {
// //       queryClient.invalidateQueries({ queryKey: ["exams"] });
// //     },
// //   });
// // };





import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as examApi from "../api/exam.api";

export const useUpdateExamStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      status,
    }: {
      examId: string;
      status: string;
    }) => examApi.updateExamStatus(examId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};

// export const usePublishExam = (examId: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: () => examApi.publishExam(examId),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["exams"] });
//       queryClient.invalidateQueries({ queryKey: ["exam-results"] });
//     },
//   });
// };