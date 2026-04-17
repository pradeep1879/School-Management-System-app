// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createTeacher } from "../services/admin.service";
// import { toast } from 'sonner'


// export const useCreateTeacher = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: createTeacher,

//     onSuccess: () => {
//       // Refetch teachers list automatically
//       queryClient.invalidateQueries({
//         queryKey: ["teachers"],
//       });

//       toast.success("New Teacher Created",)
//     },

//     onError: (error:any) =>{
//       toast.error(error.response?.data?.message ||"Error while creating the teacher")
//     }
//   });
// };
