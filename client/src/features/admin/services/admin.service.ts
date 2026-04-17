// import api from "@/services/api";

// export const adminLogin = (data:any) => api.post("/admin/login", data);

// export const adminSignup = (data:any) => api.post("/admin/signup", data);

// // export const getAdminDashboard = async () =>{
// //   const response = await  api.get("/admin/dashboard");
// //   return  response.data;
// // }
// export const getAdminDashboard = async () => {
//   // simulate network delay
//   await new Promise((resolve) => setTimeout(resolve, 1200))

//   return {
//     stats: {
//       totalClasses: 18,
//       totalTeachers: 32,
//       totalStudents: 540,
//       attendancePercent: 89,
//       pendingFees: 120000,
//       monthlyRevenue: 750000,
//     },

//     graphs: {
//       attendanceTrend: [
//         { month: "Jan", attendance: 88 },
//         { month: "Feb", attendance: 91 },
//         { month: "Mar", attendance: 86 },
//         { month: "Apr", attendance: 93 },
//         { month: "May", attendance: 89 },
//       ],

//       attendanceDistribution: [
//         { name: "Present", value: 480 },
//         { name: "Absent", value: 35 },
//         { name: "Leave", value: 25 },
//       ],

//       revenueData: [
//         { month: "Jan", revenue: 500000 },
//         { month: "Feb", revenue: 650000 },
//         { month: "Mar", revenue: 600000 },
//         { month: "Apr", revenue: 700000 },
//         { month: "May", revenue: 750000 },
//       ],
//     },

//     recentActivities: [
//       {
//         id: "1",
//         message: "New student Rahul Verma enrolled",
//         time: "2 hours ago",
//         type: "student",
//       },
//       {
//         id: "2",
//         message: "Teacher Anita applied for leave",
//         time: "4 hours ago",
//         type: "teacher",
//       },
//       {
//         id: "3",
//         message: "Fee payment received from Class 10A",
//         time: "Today",
//         type: "fee",
//       },
//     ],
//   }
// }

// export const createTeacher = async (formData: FormData) =>{
//   const response = await api.post("/admin/create-teacher", formData, {
//     headers: {
//       "Content-Type": "multiple/form-data",
//     }
//   });
//   return response.data;
// }