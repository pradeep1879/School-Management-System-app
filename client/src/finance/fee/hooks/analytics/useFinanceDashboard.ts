import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../../api/fee.api";

export const useFinanceDashboard = () => {
  return useQuery({
    queryKey: ["finance-dashboard"],
    queryFn: async () => {
      const res = await getDashboard()
      return res;
    }
  });
};

// export const useStudent = (studentId: string) => {
//   return useQuery({
//     queryKey: ["student", studentId],
//     queryFn: async () => {
//       const res = await getStudentById(studentId);
//       return res.data;
//     },
//     enabled: !!studentId,
//   });
// };