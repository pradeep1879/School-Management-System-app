import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateStudentProfile } from "../api/student.api"
import { toast } from "sonner"

export const useUpdateUsername = () => {

  const queryClient = useQueryClient()

  return useMutation({

    mutationFn: (userName: string) =>
      updateStudentProfile({ userName }),

    onSuccess: (res:any) => {
      console.log(res)
      toast.success(res?.data?.message ||"Username updated")

      queryClient.invalidateQueries({
        queryKey: ["studentProfile"]
      })

    },

    onError: (err:any) => {
      toast.error(err?.response?.data?.message ||"Failed to change username")
    }

  })
}

export const useUpdatePassword = () => {

  return useMutation({

    mutationFn: (data: {
      password: string
      confirmPassword: string
    }) => updateStudentProfile(data),

    onSuccess: (res:any) => {
      console.log(res)
      toast.success(res?.data?.message ||"Password updated")
    },

    onError: (err:any) => {
      toast.error(err?.response?.data?.message || "Failed to change password")
    }

  })
}