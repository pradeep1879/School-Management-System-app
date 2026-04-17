// import { useState } from "react"
// import { useParams, useNavigate } from "react-router-dom"
// import { useForm } from "react-hook-form"
// import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react"



// import { adminLogin } from "@/features/admin/api/admin.api"
// import { useTeacherLogin } from "@/features/teacher/hooks/useCreateTeacher"
// import { useStudentLogin } from "@/features/student/hooks/useLoginStudent"

// import { useAuthStore } from "@/store/auth.store"
// import { roleConfig } from "../hooks/role.config"

// type FormValues = {
//   email?: string
//   userName?: string
//   password: string
// }

// export default function RoleLoginPage() {

//   const { role } = useParams()
//   const navigate = useNavigate()

//   const config = roleConfig[role as keyof typeof roleConfig]

//   const setAuth = useAuthStore((s) => s.setAuth)

//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)

//   const { register, handleSubmit } = useForm<FormValues>()

//   const teacherMutation = useTeacherLogin()
//   const studentMutation = useStudentLogin()

//   const onSubmit = async (data: FormValues) => {

//     try {

//       setLoading(true)

//       if (role === "admin") {

//         const res = await adminLogin(data)

//         setAuth({
//           token: res.data.token,
//           role: "admin",
//           userId: res.data.admin.id,
//         })

//       }

//       if (role === "teacher") {

//         teacherMutation.mutate(data, {
//           onSuccess: (res) => {

//             setAuth({
//               token: res.token,
//               role: "teacher",
//               userId: res.teacher.id,
//             })

//             navigate(config.redirect)
//           },
//         })

//         return
//       }

//       if (role === "student") {
//         //@ts-ignore
//         studentMutation.mutate(data, {
//           onSuccess: (res) => {

//             setAuth({
//               //@ts-ignore
//               token: res.token,
//               role: "student",
//               //@ts-ignore
//               userId: res.student.id,
//             })

//             navigate(config.redirect)
//           },
//         })

//         return
//       }

//       navigate(config.redirect)

//     } finally {
//       setLoading(false)
//     }

//   }

//   return (

//     <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950">

//       {/* LEFT LOGIN */}
//       <div className="flex items-center justify-center px-8 py-12">

//         <div className="w-full max-w-md">

//           {/* SCHOOL BRAND */}
//           <div className="flex items-center gap-3 mb-10">

//             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
//               S
//             </div>

//             <div>
//               <h2 className="text-lg font-semibold text-white">
//                 Springdale High School
//               </h2>
//               <p className="text-xs text-slate-400">
//                 School ERP System
//               </p>
//             </div>

//           </div>

//           {/* TITLE */}
//           <div className="mb-8">

//             <p className="text-indigo-400 text-xs uppercase tracking-widest mb-2">
//               {config?.title}
//             </p>

//             <h1 className="text-3xl font-bold text-white">
//               Welcome back
//             </h1>

//             <p className="text-sm text-slate-400 mt-1">
//               {config?.subtitle}
//             </p>

//           </div>

//           {/* FORM */}
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="space-y-5"
//           >

//             {/* ADMIN / TEACHER EMAIL */}
//             {role !== "student" && (

//               <div className="relative">

//                 <Mail
//                   className="absolute left-3 top-3.5 text-slate-500"
//                   size={18}
//                 />

//                 <input
//                   type="email"
//                   placeholder="email@school.edu"
//                   className="w-full h-11 pl-10 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white"
//                   {...register("email")}
//                 />

//               </div>

//             )}

//             {/* STUDENT USERNAME */}
//             {role === "student" && (

//               <div className="relative">

//                 <User
//                   className="absolute left-3 top-3.5 text-slate-500"
//                   size={18}
//                 />

//                 <input
//                   placeholder="Username / Roll Number"
//                   className="w-full h-11 pl-10 pr-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white"
//                   {...register("userName")}
//                 />

//               </div>

//             )}

//             {/* PASSWORD */}
//             <div className="relative">

//               <Lock
//                 className="absolute left-3 top-3.5 text-slate-500"
//                 size={18}
//               />

//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 className="w-full h-11 pl-10 pr-10 rounded-lg bg-white/5 border border-white/10 text-sm text-white"
//                 {...register("password")}
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-3.5 text-slate-500"
//               >
//                 {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
//               </button>

//             </div>

//             {/* BUTTON */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full h-11 rounded-lg bg-linear-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center gap-2"
//             >

//               {loading
//                 ? <Loader2 className="animate-spin"/>
//                 : "Login to Dashboard"
//               }

//             </button>

//           </form>

//         </div>

//       </div>

//       {/* RIGHT IMAGE */}
//       <div className="hidden lg:block relative">

//         <img
//           src={config?.image}
//           className="absolute inset-0 w-full h-full object-cover brightness-75"
//         />

//         <div className="absolute inset-0 bg-linear-to-br from-indigo-900/30 to-slate-900/80"/>

//       </div>

//     </div>

//   )

// }