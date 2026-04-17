import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export const useMyFeeSummary = () => {
  return useQuery({
    queryKey: ["my-fee-summary"],

    queryFn: async () => {
      const res = await api.get("/fees/my");
      return res.data;
    },

    staleTime: 1000 * 60 * 5,
  });
};