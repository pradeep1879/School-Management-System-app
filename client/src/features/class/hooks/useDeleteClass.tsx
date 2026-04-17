import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteClass } from "../api/class.api"
import { toast } from "sonner"

export const useDeleteClass = () =>{
  const queryClient = useQueryClient()

  return useMutation({
     mutationFn: (classId: string) => deleteClass(classId),

    onSuccess: (res:any) =>{
      toast.success(res?.message || "Class deleted!!")
      queryClient.invalidateQueries({ queryKey: ["classes"]})
    },

    onError: (error:any) =>{
      toast.error(error?.response?.data?.message || "Failed to delete this class")
    }
  })
}