// @ts-nocheck
import { client } from "../../prisma/db.ts";
import { formatISTDate } from "../../utils/date.ts";


export const getAdminDashboard = async () => {

  const today = new Date(formatISTDate())

  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - 6)

  const [
    totalClasses,
    totalStudents,
    totalTeachers,

    classesWithAttendance,

    studentToday,
    teacherToday,

    weeklyStudents,
    weeklyTeachers

  ] = await Promise.all([

    client.class.count(),

    client.student.count(),

    client.teacher.count(),

    /* Classes that marked attendance today */

    client.attendanceSession.findMany({
      where:{ date: today },
      select:{ classId:true }
    }),

    /* Student attendance today */

    client.attendance.findMany({
      where:{
        session:{ date: today }
      },
      select:{ status:true }
    }),

    /* Teacher attendance today */

    client.teacherAttendance.findMany({
      where:{
        approvalStatus:"APPROVED",
        date: today
      },
      select:{ status:true }
    }),

    /* Weekly student chart */

    client.$queryRaw`
      SELECT DATE(s.date) as date,
             COUNT(a.id)::int as present
      FROM "Attendance" a
      JOIN "AttendanceSession" s
      ON a."sessionId" = s.id
      WHERE a.status = 'PRESENT'
      AND s.date BETWEEN ${startOfWeek} AND ${today}
      GROUP BY DATE(s.date)
      ORDER BY DATE(s.date)
    `,

    /* Weekly teacher chart */

    client.$queryRaw`
      SELECT DATE(date) as date,
             COUNT(id)::int as present
      FROM "TeacherAttendance"
      WHERE status='PRESENT'
      AND "approvalStatus"='APPROVED'
      AND date BETWEEN ${startOfWeek} AND ${today}
      GROUP BY DATE(date)
      ORDER BY DATE(date)
    `
  ])

  /* ---------- STUDENT STATS ---------- */

  const studentStats = {
    PRESENT:0,
    ABSENT:0,
    LEAVE:0,
    HOLIDAY:0
  }

  studentToday.forEach(record=>{
    if(studentStats[record.status] !== undefined){
      studentStats[record.status]++
    }
  })

  /* ---------- TEACHER STATS ---------- */

  const teacherStats = {
    PRESENT:0,
    ABSENT:0,
    LEAVE:0,
    HALF_DAY:0,
    HOLIDAY:0
  }

  teacherToday.forEach(t=>{
    if(teacherStats[t.status] !== undefined){
      teacherStats[t.status]++
    }
  })

  /* ---------- MISSING ATTENDANCE ---------- */

  const classesMarked = new Set(classesWithAttendance.map(c=>c.classId))

  const pendingClasses = totalClasses - classesMarked.size

  /* ---------- WEEKLY CHART ---------- */

  const studentMap = {}
  const teacherMap = {}

  weeklyStudents.forEach(row=>{
    studentMap[formatISTDate(row.date)] = Number(row.present)
  })

  weeklyTeachers.forEach(row=>{
    teacherMap[formatISTDate(row.date)] = Number(row.present)
  })

  const weeklyChart = []

  for(let i=0;i<7;i++){

    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate()+i)

    const key = formatISTDate(date)

    weeklyChart.push({
      date:key,
      studentsPresent: studentMap[key] || 0,
      teachersPresent: teacherMap[key] || 0
    })

  }

  return {

    overview:{
      totalClasses,
      totalStudents,
      totalTeachers
    },

    todayAttendance:{
      students:studentStats,
      teachers:teacherStats
    },

    attendanceStatus:{
      classesMarked: classesMarked.size,
      pendingClasses
    },

    charts:{
      weeklyAttendance: weeklyChart
    }

  }

}



export const getDailyAttendanceStats = async (days = 7) => {

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setDate(endDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  const [studentStats, teacherStats] = await Promise.all([

    client.$queryRaw`
      SELECT DATE(s.date) as date,
             COUNT(a.id) as studentsPresent
      FROM "Attendance" a
      JOIN "AttendanceSession" s
      ON a."sessionId" = s.id
      WHERE a.status = 'PRESENT'
      AND s.date BETWEEN ${startDate} AND ${endDate}
      GROUP BY DATE(s.date)
      ORDER BY DATE(s.date)
    `,

    client.$queryRaw`
      SELECT DATE(date) as date,
             COUNT(id) as teachersPresent
      FROM "TeacherAttendance"
      WHERE status = 'PRESENT'
      AND "approvalStatus" = 'APPROVED'
      AND date BETWEEN ${startDate} AND ${endDate}
      GROUP BY DATE(date)
      ORDER BY DATE(date)
    `
  ]);

  const studentMap = {};
  const teacherMap = {};

  for (const s of studentStats) {
    studentMap[formatISTDate(s.date)] = Number(s.studentspresent);
  }

  for (const t of teacherStats) {
    teacherMap[formatISTDate(t.date)] = Number(t.teacherspresent);
  }

  const result = [];

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);

    const key = formatISTDate(date);

    result.push({
      date: key,
      studentsPresent: studentMap[key] || 0,
      teachersPresent: teacherMap[key] || 0,
    });
  }

  return result;
};



export const getStudentPerformanceTrend = async (studentId) => {

  if (!studentId) {
    throw new Error("Student ID is required");
  }

  const results = await client.examResult.findMany({
    where: {
      studentId,
      examSubject: {
        exam: {
          status: "PUBLISHED"
        }
      }
    },
    include: {
      examSubject: {
        include: {
          exam: {
            select: {
              id: true,
              title: true,
              createdAt: true
            }
          }
        }
      }
    }
  });

  if (!results.length) {
    return { performance: [] };
  }

  const examMap = {};

  for (const result of results) {

    const exam = result.examSubject.exam;
    const examId = exam.id;

    if (!examMap[examId]) {
      examMap[examId] = {
        examId: exam.id,
        examTitle: exam.title,
        obtained: 0,
        total: 0,
        createdAt: exam.createdAt
      };
    }

    examMap[examId].obtained += result.obtainedMarks || 0;
    examMap[examId].total += result.examSubject.totalMarks;
  }

  const performance = Object.values(examMap)
    .map((exam) => ({
      examId: exam.examId,
      examTitle: exam.examTitle,
      percentage:
        exam.total > 0
          ? Number(((exam.obtained / exam.total) * 100).toFixed(2))
          : 0,
      createdAt: exam.createdAt
    }))
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return {
    studentId,
    performance
  };
};



export const getStudentExamPerformance = async (studentId) => {

  if (!studentId) {
    throw new Error("Student ID required");
  }

  const student = await client.student.findUnique({
    where: { id: studentId },
    select: { classId: true }
  });

  if (!student) {
    throw new Error("Student not found");
  }

  const exams = await client.exam.findMany({
    where: {
      classId: student.classId,
      status: "PUBLISHED"
    },
    select: {
      id: true,
      title: true,
      startDate: true
    },
    orderBy: {
      startDate: "desc"
    }
  });

  if (!exams.length) {
    return { exams: [], subjects: [] };
  }

  const defaultExam = exams[0];

  const examSubjects = await client.examSubject.findMany({
    where: {
      examId: defaultExam.id
    },
    include: {
      subject: true,
      results: {
        where: { studentId }
      }
    }
  });

  const subjects = examSubjects.map((s) => {

    const obtained = s.results[0]?.obtainedMarks || 0;

    return {
      subjectName: s.subject.name,
      totalMarks: s.totalMarks,
      passingMarks: s.passingMarks,
      obtainedMarks: obtained,
      status: obtained >= s.passingMarks ? "PASS" : "FAIL"
    };

  });

  return {
    studentId,
    exams,
    defaultExamId: defaultExam.id,
    subjects
  };
};

export const getStudentExamSubjects = async (studentId, examId) => {

  const examSubjects = await client.examSubject.findMany({
    where: { examId },
    include: {
      subject: true,
      results: {
        where: { studentId }
      }
    }
  });

  const subjects = examSubjects.map((s) => {

    const obtained = s.results[0]?.obtainedMarks || 0;

    return {
      subjectName: s.subject.name,
      totalMarks: s.totalMarks,
      passingMarks: s.passingMarks,
      obtainedMarks: obtained,
      status: obtained >= s.passingMarks ? "PASS" : "FAIL"
    };

  });

  return { subjects };
};


