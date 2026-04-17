// import { useState } from "react"
// import { Plus, BookOpen, Users } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"

// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// const dummySubjects = [
//   {
//     name: "Mathematics",
//     code: "MATH-101",
//     class: "10A",
//     teacher: "Rahul Sharma",
//     type: "Core",
//     status: "Active",
//   },
//   {
//     name: "Physics",
//     code: "PHY-201",
//     class: "10A",
//     teacher: "Anita Verma",
//     type: "Core",
//     status: "Active",
//   },
// ]

// export default function SubjectsPage() {
//   const [subjects, setSubjects] = useState(dummySubjects)

//   return (
//     <div className="space-y-8">

//       {/* ================= HEADER ================= */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-semibold">
//             Subjects Management
//           </h1>
//           <p className="text-sm text-muted-foreground">
//             Create and manage subjects for school
//           </p>
//         </div>

//         <Dialog>
//           <DialogTrigger asChild>
//             <Button className="gap-2">
//               <Plus size={16} />
//               Add Subject
//             </Button>
//           </DialogTrigger>

//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Create New Subject</DialogTitle>
//             </DialogHeader>

//             <div className="space-y-4 mt-4">

//               <Input placeholder="Subject Name" />

//               <Input placeholder="Subject Code" />

//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select Class" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="10A">Class 10A</SelectItem>
//                   <SelectItem value="9B">Class 9B</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Assign Teacher" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="rahul">
//                     Rahul Sharma
//                   </SelectItem>
//                   <SelectItem value="anita">
//                     Anita Verma
//                   </SelectItem>
//                 </SelectContent>
//               </Select>

//               <Select>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Subject Type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="core">Core</SelectItem>
//                   <SelectItem value="optional">Optional</SelectItem>
//                   <SelectItem value="lab">Lab</SelectItem>
//                 </SelectContent>
//               </Select>

//               <Button className="w-full">
//                 Create Subject
//               </Button>

//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* ================= STATS ================= */}
//       <div className="grid md:grid-cols-3 gap-6">
//         <Card>
//           <CardContent className="p-6 flex items-center justify-between">
//             <div>
//               <p className="text-sm text-muted-foreground">
//                 Total Subjects
//               </p>
//               <p className="text-2xl font-semibold">
//                 {subjects.length}
//               </p>
//             </div>
//             <BookOpen className="text-primary" />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardContent className="p-6 flex items-center justify-between">
//             <div>
//               <p className="text-sm text-muted-foreground">
//                 Core Subjects
//               </p>
//               <p className="text-2xl font-semibold">
//                 8
//               </p>
//             </div>
//             <Users className="text-primary" />
//           </CardContent>
//         </Card>
//       </div>

//       {/* ================= SUBJECT TABLE ================= */}
//       <Card>
//         <CardHeader>
//           <CardTitle>All Subjects</CardTitle>
//         </CardHeader>

//         <CardContent className="overflow-x-auto">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Subject</TableHead>
//                 <TableHead>Code</TableHead>
//                 <TableHead>Class</TableHead>
//                 <TableHead>Teacher</TableHead>
//                 <TableHead>Type</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>

//             <TableBody>
//               {subjects.map((subject, index) => (
//                 <TableRow key={index}>
//                   <TableCell className="font-medium">
//                     {subject.name}
//                   </TableCell>
//                   <TableCell>{subject.code}</TableCell>
//                   <TableCell>{subject.class}</TableCell>
//                   <TableCell>{subject.teacher}</TableCell>
//                   <TableCell>
//                     <Badge variant="secondary">
//                       {subject.type}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>
//                     <Badge className="bg-green-500/10 text-green-600">
//                       {subject.status}
//                     </Badge>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>

//           </Table>
//         </CardContent>
//       </Card>

//     </div>
//   )
// }