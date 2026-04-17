// import { useParams, useNavigate } from "react-router-dom";

// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { useExamResultsOverview } from "../../hooks/useResult";

// export default function ExamResultsPage() {
//   const { examId } = useParams();
//   const navigate = useNavigate();

//   const { data, isLoading } =
//     useExamResultsOverview(examId!);
//     console.log(data)

//   if (isLoading)
//     return <div className="p-6">Loading results...</div>;

//   if (!data)
//     return <div className="p-6">No results found</div>;

//   const {
//     totalStudents,
//     passCount,
//     failCount,
//     average,
//     passPercentage,
//     topper,
//     results,
//   } = data;

//   return (
//     <div className="space-y-6 p-6">

//       {/* Stats Cards */}
//       <div className="grid md:grid-cols-4 gap-4">
//         <StatCard label="Total Students" value={totalStudents} />
//         <StatCard label="Pass" value={passCount} />
//         <StatCard label="Fail" value={failCount} />
//         <StatCard label="Average %" value={average} />
//       </div>

//       {/* Topper */}
//       {topper && (
//         <Card className="border border-primary/20">
//           <CardContent className="p-4 flex justify-between items-center">
//             <div>
//               <p className="text-sm text-muted-foreground">
//                 Topper
//               </p>
//               <p className="font-semibold">
//                 {topper.student.studentName}
//               </p>
//             </div>
//             <Badge className="bg-green-100 text-green-700">
//               {topper.percentage}%
//             </Badge>
//           </CardContent>
//         </Card>
//       )}

//       {/* Results Table */}
//       <Card>
//         <CardContent className="p-4 overflow-auto">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="text-left border-b">
//                 <th>Rank</th>
//                 <th>Name</th>
//                 <th>Total</th>
//                 <th>%</th>
//                 <th>Grade</th>
//                 <th>Status</th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {results.map((r: any) => (
//                 <tr key={r.student.id} className="border-b">
//                   <td>{r.rank}</td>
//                   <td>{r.student.studentName}</td>
//                   <td>
//                     {r.totalObtained}/{r.totalMarks}
//                   </td>
//                   <td>{r.percentage}%</td>
//                   <td>{r.grade}</td>
//                   <td>
//                     <Badge
//                       className={
//                         r.status === "PASS"
//                           ? "bg-green-100 text-green-700"
//                           : "bg-red-100 text-red-700"
//                       }
//                     >
//                       {r.status}
//                     </Badge>
//                   </td>
//                   <td>
//                     <Button
//                       size="sm"
//                       variant="outline"
//                       onClick={() =>
//                         navigate(
//                           `/staff/exam/${examId}/result/${r.student.id}`
//                         )
//                       }
//                     >
//                       View
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// function StatCard({ label, value }: any) {
//   return (
//     <Card>
//       <CardContent className="p-4">
//         <p className="text-sm text-muted-foreground">
//           {label}
//         </p>
//         <p className="text-xl font-semibold">
//           {value}
//         </p>
//       </CardContent>
//     </Card>
//   );
// }