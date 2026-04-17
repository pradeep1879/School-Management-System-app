// import cron from "node-cron";
// import { client } from "../../../prisma/db.ts";

// /**
//  * AUTO MARK ABSENT IF TEACHER DOESN'T SUBMIT ATTENDANCE
//  */

// export const startTeacherAttendanceCron = () => {
//   cron.schedule("59 23 * * *", async () => {
//     try {
//       console.log("Running teacher attendance auto-mark cron...");

//       const today = new Date();
//       today.setUTCHours(0, 0, 0, 0);

//       const teachers = await client.teacher.findMany({
//         select: { id: true },
//       });

//       if (!teachers.length) {
//         console.log("No teachers found");
//         return;
//       }

//       const teacherIds = teachers.map((t) => t.id);

//       const existingAttendance = await client.teacherAttendance.findMany({
//         where: {
//           date: today,
//           teacherId: { in: teacherIds },
//         },
//         select: {
//           teacherId: true,
//         },
//       });

//       const markedTeacherIds = new Set(
//         existingAttendance.map((a) => a.teacherId)
//       );

//       const missingTeachers = teacherIds.filter(
//         (id) => !markedTeacherIds.has(id)
//       );

//       if (!missingTeachers.length) {
//         console.log("All teachers already submitted attendance");
//         return;
//       }

//       await client.teacherAttendance.createMany({
//         data: missingTeachers.map((teacherId) => ({
//           teacherId,
//           date: today,
//           status: "ABSENT",
//           approvalStatus: "APPROVED",
//           submittedById: teacherId,
//           verifiedAt: new Date(),
//         })),
//       });

//       console.log(
//         `Auto-marked ABSENT for ${missingTeachers.length} teachers`
//       );
//     } catch (error) {
//       console.error("Teacher attendance cron error:", error);
//     }
//   });
// };