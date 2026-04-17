import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateTeacherProfile } from "../api/teacher.api"
import { toast } from "sonner"


export const useUpdateTeacherUsername = () => {

  const queryClient = useQueryClient()

  return useMutation({

    mutationFn: (email: string) =>
      updateTeacherProfile({ email }),

    onSuccess: (res:any) => {
      console.log(res)
      toast.success(res?.data?.message || "Username updated")

      queryClient.invalidateQueries({
        queryKey: ["teacherProfile"]
      })

    },

    onError: (err:any) => {
      toast.error(err?.response?.data?.message ||"Failed to change username")
    }

  })
}

export const useUpdateTeacherPassword = () => {

  return useMutation({

    mutationFn: (data: {
      email: string
      oldPassword:string
      password: string
      confirmPassword: string
    }) => updateTeacherProfile(data),

    onSuccess: (res:any) => {
      console.log(res)
      toast.success(res?.data?.message || "Password updated")
    },

    onError: (err:any) => {
      toast.error(err?.response?.data?.message || "Failed to change password")
    }

  })
}