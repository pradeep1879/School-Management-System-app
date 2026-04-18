import dotenv from "dotenv";

dotenv.config();
import express, { type Request, type Response } from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import adminRoutes from "./src/modules/admin/admin.routes.ts";
import teacherRoutes from "./src/modules/teacher/teacher.routes.ts";
import classRoutes from "./src/modules/class/class.routes.ts";
import studentRoutes from "./src/modules/student/student.routes.ts";
import subjectRoutes from "./src/modules/subject/subject.routes.ts";
import syllabusRoutes from "./src/modules/subject/syllabus/syllabus.routes.ts";
import activityRoutes from "./src/modules/activity/activity.routes.ts";
import examRoutes from "./src/modules/exam/exam.routes.ts";
import homeWorkRoutes from "./src/modules/homeWork/homework.routes.ts";
import attendanceRoutes from "./src/modules/attendance/studentAttendace/attendance.routes.ts";
import feeRoutes from "./src/modules/fee/fee.routes.ts";
import teacherAttendanceRoutes from "./src/modules/attendance/teacherAttendance/teacherAttendance.routes.ts";
import teacherSalaryRoutes from "./src/modules/salary/salary.routes.ts";
import analyticsRoutes from "./src/modules/analytics/analytics.routes.ts";
import examAnalyticsRoutes from "./src/modules/analytics/exam/exm.ana.routes.ts";
import announcementRoutes from "./src/modules/announcement/announcement.routes.ts";
import aiQuizRoutes from "./src/modules/aiQuiz/aiQuiz.routes.ts";

import { globalErrorHandler } from "./src/middlewares/error.middleware.ts";

import "./src/services/notification/notification.handler.ts";
import { startWebSocket } from "./src/websocket/wsServer.ts";

const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/teacher/attendance", teacherAttendanceRoutes);
app.use("/api/v1/teacher/salary", teacherSalaryRoutes);
app.use("/api/v1/teacher", teacherRoutes);
app.use("/api/v1/classes", classRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/syllabus", syllabusRoutes);
app.use("/api/v1/activity", activityRoutes);
app.use("/api/v1/exam", examRoutes);
app.use("/api/v1/exam/analytics", examAnalyticsRoutes);
app.use("/api/v1/homework", homeWorkRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/fees", feeRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/announcements", announcementRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/v1/ai-quiz", aiQuizRoutes);

app.use(globalErrorHandler);

startWebSocket(server);

const port = process.env.PORT;

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${port} is already in use. Update backend/.env PORT or stop the process using that port.`,
    );
    process.exit(1);
  }

  throw error;
});

server.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
