// import {
//   Plus,
//   Search,
//   Calendar,
//   User,
//   MoreVertical,
// } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"


// const activities = [
//   {
//     id: 1,
//     title: "Science Exhibition",
//     type: "Academic",
//     date: "12 March 2026",
//     organizer: "Anita Verma",
//     description: "Students will present science models and experiments.",
//     status: "Upcoming",
//   },
//   {
//     id: 2,
//     title: "Inter-Class Football Match",
//     type: "Sports",
//     date: "18 March 2026",
//     organizer: "Rahul Sharma",
//     description: "Football match between Class 10A and 10B.",
//     status: "Ongoing",
//   },
//   {
//     id: 3,
//     title: "Annual Cultural Fest",
//     type: "Cultural",
//     date: "2 March 2026",
//     organizer: "Amit Joshi",
//     description: "Dance, drama, and music performances.",
//     status: "Completed",
//   },
// ]

// export default function ClassActivitiesSection() {
//   return (
//     <div className="space-y-6">

//       {/* ================= HEADER ================= */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-semibold">
//             Class Activities
//           </h2>
//           <p className="text-sm text-muted-foreground">
//             Manage events and activities for this class
//           </p>
//         </div>

//         <div className="flex items-center gap-3 w-full sm:w-auto">
//           <div className="relative w-full sm:w-64">
//             <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search activity..."
//               className="pl-9"
//             />
//           </div>

//           <Button className="gap-2">
//             <Plus size={16} />
//             Add Activity
//           </Button>
//         </div>
//       </div>

//       {/* ================= GRID ================= */}
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {activities.map((activity) => (
//           <div
//             key={activity.id}
//             className="border border-border/50 rounded-xl p-6 bg-card hover:shadow-lg transition-all duration-300 group"
//           >

//             {/* Top Row */}
//             <div className="flex items-start justify-between">
//               <div>
//                 <h3 className="text-lg font-semibold">
//                   {activity.title}
//                 </h3>
//                 <p className="text-xs text-muted-foreground">
//                   {activity.type}
//                 </p>
//               </div>

//               <Button variant="ghost" size="icon">
//                 <MoreVertical size={16} />
//               </Button>
//             </div>

//             {/* Description */}
//             <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
//               {activity.description}
//             </p>

//             {/* Meta Info */}
//             <div className="mt-5 space-y-2 text-sm">

//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <Calendar size={14} />
//                 {activity.date}
//               </div>

//               <div className="flex items-center gap-2 text-muted-foreground">
//                 <User size={14} />
//                 {activity.organizer}
//               </div>

//             </div>

//             {/* Status */}
//             <div className="mt-5 flex items-center justify-between">
//               <Badge
//                 variant={
//                   activity.status === "Completed"
//                     ? "secondary"
//                     : activity.status === "Ongoing"
//                     ? "default"
//                     : "outline"
//                 }
//               >
//                 {activity.status}
//               </Badge>

//               <Button
//                 size="sm"
//                 variant="outline"
//                 className="opacity-0 group-hover:opacity-100 transition"
//               >
//                 View
//               </Button>
//             </div>

//           </div>
//         ))}
//       </div>

//     </div>
//   )
// }