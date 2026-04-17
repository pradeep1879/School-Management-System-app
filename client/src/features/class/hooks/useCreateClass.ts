import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClass, updateClass } from "../api/class.api";
import { toast } from "sonner";

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createClass,

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    },

    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    },
  });
};

export const useUpdateClass = () =>{
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, data }: {
      classId: string;
      data: {
        slug?: string;
        section?: string;
        session?: string;
      };
    }) => updateClass(data, classId),

    onSuccess: (res:any) =>{
      toast.success(res.message);

      queryClient.invalidateQueries({ queryKey: ["classes"]});
      queryClient.invalidateQueries({ queryKey: ["class"]})
    },
     
    onError: (error:any) =>{
      toast.error(
        error?.response?.data?.message || "Failed to update class"
      );
    },
  });
}




