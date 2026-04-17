import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAdminProfile } from "../api/admin.api"
import { toast } from "sonner"

export const useUpdateAdminEmail = () => {

  const queryClient = useQueryClient()

  return useMutation({

    mutationFn: (email: string) =>
      updateAdminProfile({ email }),

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

export const useUpdateAdminPassword = () => {

  return useMutation({

    mutationFn: (data: {
      email: string
      oldPassword:string
      password: string
      confirmPassword: string
    }) => updateAdminProfile(data),

    onSuccess: (res:any) => {
      console.log(res)
      toast.success(res?.data?.message || "Password updated")
    },

    onError: (err:any) => {
      toast.error(err?.response?.data?.message || "Failed to change password")
    }

  })
}