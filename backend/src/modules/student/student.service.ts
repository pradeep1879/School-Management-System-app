// @ts-nocheck
import { client } from "../../prisma/db.ts";
import { imagekit } from "../../config/imagekit.ts";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import fs from "fs";
import config from "../../../config.ts";
import { normalizeAcademicSession } from "../../utils/session.ts";

const formatDateKey = (value) => {
  if (!value) return null;

  const date = new Date(value);

  return date.toISOString().split("T")[0];
};

const roundTo = (value, digits = 1) => {
  if (!Number.isFinite(value)) return 0;

  return Number(value.toFixed(digits));
};

const getTrendDirection = (value) => {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "neutral";
};

const getAnnouncementScopeLabel = (targetType) => {
  if (targetType === "CLASS") return "Class announcement";
  return "School announcement";
};

export const createStudent = async (body, files, adminId) => {
  const {
    studentName,
    userName,
    rollNumber,
    password,
    gender,
    fatherName,
    dateOfBirth,
    admissionDate,
    contactNo,
    address,
    classId,
    teacherId,
  } = body;

  if (
    !studentName ||
    !userName ||
    !rollNumber ||
    !gender ||
    !password ||
    !fatherName ||
    !dateOfBirth ||
    !admissionDate ||
    !contactNo ||
    !address ||
    !classId 
  ) {
    throw new Error("All required fields must be provided");
  }

  const existing = await client.student.findUnique({
    where: { userName },
  });

  if (existing) {
    throw new Error("Student username already exists");
  }

  // Validate class
  const classExists = await client.class.findFirst({
    where: { id: classId, adminId },
  });

  if (!classExists) {
    throw new Error("Invalid class");
  }

  let imageUrl = null;
  let imageFileId = null;

  // Upload image if provided
  if (files?.image) {
    const imageFile = files.image;

    const allowedFormat = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedFormat.includes(imageFile.mimetype)) {
      throw new Error("Invalid image format");
    }

    const uploadResponse = await imagekit.upload({
      file: fs.readFileSync(imageFile.tempFilePath),
      fileName: `${Date.now()}_${imageFile.name}`,
      folder: "/students",
    });

    imageUrl = uploadResponse.url;
    imageFileId = uploadResponse.fileId;

    fs.unlinkSync(imageFile.tempFilePath);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = await client.student.create({
    data: {
      studentName,
      userName,
      rollNumber,
      password: hashedPassword,
      gender,
      fatherName,
      admissionDate: new Date(admissionDate),
      dateOfBirth: new Date(dateOfBirth),
      contactNo,
      address,
      classId,
      teacherId: teacherId || null,
      imageUrl,
      imageFileId,
    },
  });

  return {
    message: "Student created successfully",
    student,
  };
};


export const loginStudent = async ({ userName, password }) => {
  if (!userName || !password) {
    throw new Error("Username and password required");
  }

  const student = await client.student.findUnique({
    where: { userName },
  });

  if (!student) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, student.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: student.id, role: "student" },
    config.JWT_SECRET,
    { expiresIn: "1d" }
  );

  const { password: _, ...safeStudent } = student;

  return {
    message: "Login successful",
    token,
    student: safeStudent,
  };
};

export const logout = async() => {
  return {
    success: true,
    message: "Teacher logged out successfully",
  };
}

export const getMyProfile = async (studentId) => {
  const student = await client.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      studentName: true,
      userName: true,
      imageUrl: true,
      rollNumber: true,
      gender: true,
      contactNo: true,
      class: {
        select: {
          id: true,
          slug: true,
          section: true,
          session: true,
        },
      },
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  return {
    success: true,
    student,
  };
};

export const getMyClass = async (studentId) => {
  if (!studentId) {
    throw new Error("Student ID required");
  }

  const student = await client.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      class: {
        select: {
          id: true,
          slug: true,
          section: true,
          session: true,
        },
      },
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  return {
    classDetail: student.class,
  };
};

export const getStudentsByClass = async (classId, query, role, userId) => {
  if (!classId) {
    throw new Error("Class ID is required");
  }

  const existingClass = await client.class.findUnique({
    where: { id: classId },
  });

  if (!existingClass) {
    throw new Error("Class not found");
  }

  //  Authorization
  if (role === "teacher" && existingClass.teacherId !== userId) {
    throw new Error("Unauthorized access");
  }

  if (role === "admin" && existingClass.adminId !== userId) {
    throw new Error("Unauthorized access");
  }

  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const search = query.search || "";

  const skip = (page - 1) * limit;

  const whereCondition = {
    classId,
    OR: [
      { studentName: { contains: search, mode: "insensitive" } },
      { userName: { contains: search, mode: "insensitive" } },
      { rollNumber: { contains: search, mode: "insensitive" } },
    ],
  };

  const [students, total] = await Promise.all([
    client.student.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { createdAt: "asc" },
    }),
    client.student.count({ where: whereCondition }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    students,
  };
};

export const getStudentById = async (studentId, role, userId) => {
  if (!studentId) {
    throw new Error("Student ID is required");
  }

  const student = await client.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      studentName: true,
      userName: true,
      gender: true,
      imageUrl: true,
      rollNumber: true,
      fatherName: true,
      contactNo: true,
      admissionDate: true,
      dateOfBirth: true,
      address: true,

      class: {
        select: {
          id: true,
          slug: true,
          section: true,
          session: true,
          adminId: true,
          teacherId: true
        },
      },

      teacher: {
        select: {
          id: true,
          teacherName: true,
          email: true,
        },
      },

      attendance: {
        select: {
          id: true,
          status: true,
        },
      },
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  //  Authorization
  if (role === "admin" && student.class.adminId !== userId) {
    throw new Error("Unauthorized access");
  }

  if (role === "teacher" && student.class.teacherId !== userId) {
    throw new Error("Unauthorized access");
  }

  return {
    success: true,
    student,
  };
};

export const getAllStudents = async (query, adminId) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const search = query.search || "";
  const classId = query.classId || null;
  const session = query.session
    ? normalizeAcademicSession(query.session)
    : null;

  const skip = (page - 1) * limit;


  const whereCondition = {
    ...(classId && { classId }),
    ...(session && {
      class: {
        session,
      },
    }),
    ...(search && {
      OR: [
        { studentName: { contains: search, mode: "insensitive" } },
        { userName: { contains: search, mode: "insensitive" } },
        { rollNumber: { contains: search, mode: "insensitive" } },
      ],
    }),
  };

  const [students, total] = await Promise.all([
    client.student.findMany({
      where: whereCondition,
      skip,
      take: limit,
      select: {
        id: true,
        studentName: true,
        userName: true,
        rollNumber: true,
        gender: true,
        contactNo: true,
        imageUrl: true,
        class: {
          select: {
            id: true,
            slug: true,
            section: true,
            session: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    client.student.count({
      where: whereCondition,
    }),
  ]);

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    students,
  };
};

export const getDashboardSummary = async (studentId) => {
  if (!studentId) {
    throw new Error("Student ID is required");
  }

  const student = await client.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      studentName: true,
      userName: true,
      imageUrl: true,
      rollNumber: true,
      gender: true,
      contactNo: true,
      classId: true,
      class: {
        select: {
          id: true,
          slug: true,
          section: true,
          session: true,
        },
      },
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const today = new Date();
  const todayStart = new Date(today);
  todayStart.setHours(0, 0, 0, 0);

  const [
    attendanceRecords,
    homeworks,
    publishedExams,
    upcomingExams,
    announcements,
    recentQuizAttempts,
  ] = await Promise.all([
    client.attendance.findMany({
      where: { studentId },
      select: {
        status: true,
        session: {
          select: {
            date: true,
          },
        },
      },
      orderBy: {
        session: {
          date: "asc",
        },
      },
    }),
    client.homework.findMany({
      where: { classId: student.classId },
      select: {
        id: true,
        title: true,
        dueDate: true,
        status: true,
        subjects: {
          select: {
            description: true,
            subject: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        dueDate: "asc",
      },
    }),
    client.exam.findMany({
      where: {
        classId: student.classId,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        subjects: {
          select: {
            totalMarks: true,
            passingMarks: true,
            subject: {
              select: {
                name: true,
              },
            },
            results: {
              select: {
                studentId: true,
                obtainedMarks: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    }),
    client.exam.findMany({
      where: {
        classId: student.classId,
        OR: [
          {
            status: "ONGOING",
          },
          {
            status: "SCHEDULED",
            startDate: {
              gte: todayStart,
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        status: true,
        startDate: true,
      },
      orderBy: {
        startDate: "asc",
      },
      take: 4,
    }),
    client.announcement.findMany({
      where: {
        OR: [
          { targetType: "SCHOOL" },
          { targetType: "CLASS", classId: student.classId },
        ],
      },
      select: {
        id: true,
        title: true,
        message: true,
        targetType: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 4,
    }),
    client.aIQuizAttempt.findMany({
      where: { studentId },
      select: {
        percentage: true,
        submittedAt: true,
      },
      orderBy: {
        startedAt: "desc",
      },
      take: 5,
    }),
  ]);

  const attendanceMeaningful = attendanceRecords.filter(
    (record) => record.status !== "HOLIDAY"
  );
  const attendedCount = attendanceMeaningful.filter((record) =>
    ["PRESENT", "LATE"].includes(record.status)
  ).length;
  const attendancePercentage = attendanceMeaningful.length
    ? roundTo((attendedCount / attendanceMeaningful.length) * 100, 1)
    : 0;

  const recentAttendance = attendanceMeaningful.slice(-60);
  const previousAttendance = attendanceMeaningful.slice(-120, -60);
  const recentAttendanceRate = recentAttendance.length
    ? (recentAttendance.filter((record) => ["PRESENT", "LATE"].includes(record.status)).length /
        recentAttendance.length) *
      100
    : attendancePercentage;
  const previousAttendanceRate = previousAttendance.length
    ? (previousAttendance.filter((record) => ["PRESENT", "LATE"].includes(record.status)).length /
        previousAttendance.length) *
      100
    : recentAttendanceRate;
  const attendanceTrend = roundTo(recentAttendanceRate - previousAttendanceRate, 1);

  const attendanceHeatmap = attendanceRecords.slice(-90).map((record) => ({
    date: formatDateKey(record.session.date),
    status: record.status,
    value:
      record.status === "PRESENT"
        ? 4
        : record.status === "LATE"
          ? 3
          : record.status === "LEAVE"
            ? 2
            : record.status === "ABSENT"
              ? 1
              : 0,
  }));

  const examSummaries = publishedExams.map((exam) => {
    const totalMarks = exam.subjects.reduce(
      (sum, subject) => sum + subject.totalMarks,
      0
    );
    const studentTotals = {};
    const subjectAverages = {};

    for (const subject of exam.subjects) {
      const subjectTotal = subject.totalMarks || 0;
      const totalObtained = subject.results.reduce(
        (sum, result) => sum + (result.obtainedMarks || 0),
        0
      );
      const resultCount = subject.results.length;

      subjectAverages[subject.subject.name] =
        resultCount && subjectTotal
          ? roundTo((totalObtained / (resultCount * subjectTotal)) * 100, 1)
          : 0;

      for (const result of subject.results) {
        if (!studentTotals[result.studentId]) {
          studentTotals[result.studentId] = {
            obtained: 0,
            total: 0,
          };
        }

        studentTotals[result.studentId].obtained += result.obtainedMarks || 0;
        studentTotals[result.studentId].total += subjectTotal;
      }
    }

    const rankedStudents = Object.entries(studentTotals)
      .map(([rankStudentId, totals]) => ({
        studentId: rankStudentId,
        percentage: totals.total
          ? roundTo((totals.obtained / totals.total) * 100, 2)
          : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    const studentIndex = rankedStudents.findIndex(
      (item) => item.studentId === studentId
    );
    const classAverage = rankedStudents.length
      ? roundTo(
          rankedStudents.reduce((sum, item) => sum + item.percentage, 0) /
            rankedStudents.length,
          1
        )
      : 0;
    const studentRecord = studentTotals[studentId] || {
      obtained: 0,
      total: totalMarks,
    };

    return {
      examId: exam.id,
      examTitle: exam.title,
      date: formatDateKey(exam.startDate),
      studentPercentage: studentRecord.total
        ? roundTo((studentRecord.obtained / studentRecord.total) * 100, 1)
        : 0,
      classAverage,
      rank: studentIndex >= 0 ? studentIndex + 1 : null,
      classStrength: rankedStudents.length,
      subjectAverages,
      subjects: exam.subjects,
    };
  });

  const performanceOverview = examSummaries.map((exam) => ({
    examId: exam.examId,
    examTitle: exam.examTitle,
    date: exam.date,
    studentMarks: exam.studentPercentage,
    classAverage: exam.classAverage,
  }));

  const rankTrend = examSummaries.map((exam) => ({
    examId: exam.examId,
    examTitle: exam.examTitle,
    date: exam.date,
    rank: exam.rank,
  }));

  const latestExam = examSummaries.length
    ? examSummaries[examSummaries.length - 1]
    : null;
  const previousExam = examSummaries.length > 1
    ? examSummaries[examSummaries.length - 2]
    : null;

  const avgMarks = examSummaries.length
    ? roundTo(
        examSummaries.reduce((sum, exam) => sum + exam.studentPercentage, 0) /
          examSummaries.length,
        1
      )
    : 0;
  const marksTrend = previousExam
    ? roundTo(latestExam.studentPercentage - previousExam.studentPercentage, 1)
    : 0;
  const rankTrendDelta =
    latestExam && previousExam && latestExam.rank && previousExam.rank
      ? previousExam.rank - latestExam.rank
      : 0;

  const subjectStatsMap = {};

  for (const exam of examSummaries) {
    for (const subject of exam.subjects) {
      const name = subject.subject.name;
      const studentResult = subject.results.find(
        (result) => result.studentId === studentId
      );
      const subjectPercentage = subject.totalMarks
        ? roundTo(
            ((studentResult?.obtainedMarks || 0) / subject.totalMarks) * 100,
            1
          )
        : 0;

      if (!subjectStatsMap[name]) {
        subjectStatsMap[name] = {
          subject: name,
          totalStudentPercentage: 0,
          totalClassAverage: 0,
          examCount: 0,
          latestScore: 0,
          latestClassAverage: 0,
          latestFailed: false,
          latestBelowClassAverage: false,
          failCount: 0,
        };
      }

      const passedLatestSubject = (studentResult?.obtainedMarks || 0) >= subject.passingMarks;
      const latestClassAverage = exam.subjectAverages[name] || 0;

      subjectStatsMap[name].totalStudentPercentage += subjectPercentage;
      subjectStatsMap[name].totalClassAverage += latestClassAverage;
      subjectStatsMap[name].examCount += 1;
      subjectStatsMap[name].latestScore = subjectPercentage;
      subjectStatsMap[name].latestClassAverage = latestClassAverage;
      subjectStatsMap[name].latestFailed = !passedLatestSubject;
      subjectStatsMap[name].latestBelowClassAverage =
        subjectPercentage < latestClassAverage;

      if (!passedLatestSubject) {
        subjectStatsMap[name].failCount += 1;
      }
    }
  }

  const subjectPerformance = Object.values(subjectStatsMap)
    .map((subject) => ({
      subject: subject.subject,
      averageMarks: subject.examCount
        ? roundTo(subject.totalStudentPercentage / subject.examCount, 1)
        : 0,
      classAverage: subject.examCount
        ? roundTo(subject.totalClassAverage / subject.examCount, 1)
        : 0,
      latestScore: subject.latestScore,
      latestClassAverage: subject.latestClassAverage,
      latestFailed: subject.latestFailed,
      latestBelowClassAverage: subject.latestBelowClassAverage,
      failCount: subject.failCount,
    }))
    .sort((a, b) => b.averageMarks - a.averageMarks);

  const weakSubjects = subjectPerformance
    .slice()
    .sort((a, b) => {
      if (a.latestFailed !== b.latestFailed) {
        return Number(b.latestFailed) - Number(a.latestFailed);
      }

      if (a.latestBelowClassAverage !== b.latestBelowClassAverage) {
        return (
          Number(b.latestBelowClassAverage) - Number(a.latestBelowClassAverage)
        );
      }

      if (a.latestScore !== b.latestScore) {
        return a.latestScore - b.latestScore;
      }

      if (a.failCount !== b.failCount) {
        return b.failCount - a.failCount;
      }

      return a.averageMarks - b.averageMarks;
    })
    .slice(0, 2);

  const assignedHomework = homeworks.filter(
    (homework) => homework.status === "ASSIGNED"
  );
  const pendingHomework = assignedHomework.filter(
    (homework) => new Date(homework.dueDate) >= todayStart
  );
  const completedAssignments = homeworks.filter(
    (homework) => homework.status === "COMPLETED"
  ).length;

  const upcoming = [
    ...upcomingExams.map((exam) => ({
      id: `exam-${exam.id}`,
      title: exam.title,
      type: "exam",
      date: exam.startDate,
      status: exam.status,
      meta: "Exam",
      url: `/student/exams`,
    })),
    ...pendingHomework.slice(0, 4).map((homework) => ({
      id: `homework-${homework.id}`,
      title: homework.title,
      type: "homework",
      date: homework.dueDate,
      status: homework.status,
      meta:
        homework.subjects.map((subject) => subject.subject.name).join(", ") ||
        "Homework",
      url: `/student/homework`,
    })),
  ]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 6)
    .map((item) => ({
      ...item,
      date: formatDateKey(item.date),
    }));

  const recentResults = examSummaries
    .slice()
    .reverse()
    .slice(0, 3)
    .map((exam) => ({
      id: `result-${exam.examId}`,
      type: "result",
      title: `${exam.examTitle} published`,
      description: `Scored ${exam.studentPercentage}%${exam.rank ? `, rank #${exam.rank}` : ""}`,
      date: exam.date,
      url: `/student/exam/${exam.examId}`,
    }));

  const recentAnnouncements = announcements.map((announcement) => ({
    id: `announcement-${announcement.id}`,
    type: "announcement",
    title: announcement.title,
    description: getAnnouncementScopeLabel(announcement.targetType),
    date: formatDateKey(announcement.createdAt),
    url: `/student/announcements`,
  }));

  const recentActivity = [...recentResults, ...recentAnnouncements]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  const latestQuizScore = recentQuizAttempts[0]?.percentage || 0;

  return {
    success: true,
    summary: {
      student,
      attendance: {
        percentage: attendancePercentage,
        attendedCount,
        totalCount: attendanceMeaningful.length,
        trend: attendanceTrend,
        heatmap: attendanceHeatmap,
      },
      avgMarks,
      rank: latestExam?.rank ?? null,
      quickStats: {
        attendance: attendancePercentage,
        upcomingExams: upcomingExams.length,
        pendingHomework: assignedHomework.length,
        latestRank: latestExam?.rank ?? null,
        avgMarks,
        completedAssignments,
        latestQuizScore: roundTo(latestQuizScore, 1),
      },
      trends: {
        performanceOverview,
        rankTrend,
        marksTrend,
        rankTrendDelta,
      },
      subjectPerformance,
      upcoming,
      recentActivity,
      insights: {
        weakSubjects: weakSubjects.map((subject) => subject.subject),
        suggestedAction: weakSubjects[0]
          ? `Practice ${weakSubjects[0].subject} first${weakSubjects[0].latestFailed ? " because it was failed in the latest exam" : weakSubjects[0].latestBelowClassAverage ? " because it is below the latest class average" : ""}, then revise the latest concepts.`
          : "Keep up your momentum with one focused revision session today.",
        recommendedQuizTopic: weakSubjects[0]?.subject || "Mixed Practice",
      },
    },
  };
};


export const updateMyProfile = async (studentId, body) => {
  const { userName, password, confirmPassword } = body;

  const student = await client.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const updateData = {};

  // Update username
  if (userName) {
    const existing = await client.student.findUnique({
      where: { userName },
    });

    if (existing && existing.id !== studentId) {
      throw new Error("Username already taken");
    }

    updateData.userName = userName;
  }

  // Update password
  if (password || confirmPassword) {
    if (!password || !confirmPassword) {
      throw new Error("Password and confirm password required");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    updateData.password = hashedPassword;
  }

  if (Object.keys(updateData).length === 0) {
    throw new Error("Nothing to update");
  }

  const updatedStudent = await client.student.update({
    where: { id: studentId },
    data: updateData,
  });

  const { password: _, ...safeStudent } = updatedStudent;

  return {
    message: "Profile updated successfully",
    student: safeStudent,
  };
};
