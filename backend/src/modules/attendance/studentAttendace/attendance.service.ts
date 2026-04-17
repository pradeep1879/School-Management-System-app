// @ts-nocheck
import { client } from "../../../prisma/db.ts";
import { formatISTDate, getISTStartOfDay } from "../../../utils/date.ts";


// mark attendance of class, default status is present
export const markAttendance = async (body, teacherId) => {

  const { classId, date, exceptions = [] } = body;

  if (!classId || !date) {
    throw new Error("ClassId and date are required");
  }

  /*  Ist (indian time) */

  const attendanceDate = new Date(formatISTDate(date));




  const classData = await client.class.findFirst({
    where: {
      id: classId,
      teacherId,
    },
    include: {
      students: {
        select: { id: true },
      },
    },
  });

  if (!classData) {
    throw new Error("Unauthorized or class not found");
  }

  const adminId = classData.adminId;
  const students = classData.students;

  if (!students.length) {
    throw new Error("No students found in class");
  }

  // validate expceptions
  const studentIds = new Set(students.map(s => s.id));
  const exceptionMap = new Map();

  const allowedStatuses = ["ABSENT", "LATE", "LEAVE", "HOLIDAY"];

  for (const item of exceptions) {

    if (!studentIds.has(item.studentId)) {
      throw new Error("Invalid student in exceptions");
    }

    if (exceptionMap.has(item.studentId)) {
      throw new Error("Duplicate student in exceptions");
    }

    if (!allowedStatuses.includes(item.status)) {
      throw new Error("Invalid attendance status");
    }

    exceptionMap.set(item.studentId, item.status);
  }

  const attendanceRecords = students.map(student => ({
    studentId: student.id,
    status: exceptionMap.get(student.id) || "PRESENT"
  }));


  try {

    const session = await client.$transaction(async (tx) => {

      const newSession = await tx.attendanceSession.create({
        data: {
          classId,
          teacherId,
          adminId,
          date: attendanceDate
        }
      });

      await tx.attendance.createMany({
        data: attendanceRecords.map(record => ({
          sessionId: newSession.id,
          studentId: record.studentId,
          status: record.status
        }))
      });

      return newSession;
    });

    return {
      message: "Attendance marked successfully",
      sessionId: session.id
    };

  } catch (error) {

    if (error.code === "P2002") {
      throw new Error("Attendance already marked for this date");
    }

    throw error;
  }
};

// get attendace by date for teacher 
export const getAttendanceByDate = async (classId, date) => {

  const attendanceDate = new Date(date);

  const session = await client.attendanceSession.findUnique({
    where: {
      classId_date: {
        classId,
        date: attendanceDate
      }
    },
    include: {
      records: {
        orderBy: {
          student: {
            rollNumber: "asc"
          }
        },
        select: {
          id: true,
          status: true,
          student: {
            select: {
              id: true,
              studentName: true,
              rollNumber: true
            }
          }
        }
      }
    }
  });

  if (!session) {
    throw new Error("Attendance not found for this date");
  }

  return {
    sessionId: session.id,
    attendance: session.records
  };
};

export const getStudentAttendanceHistory = async (
  studentId,
  query,
  userId,
  role
) => {
  const { startDate, endDate } = query;

  // Validate student exists
  const student = await client.student.findUnique({
    where: { id: studentId },
    include: {
      class: true,
    },
  });

  if (!student) {
    throw new Error("Student not found");
  }

  // Authorization check
  if (role === "teacher" && student.class?.teacherId !== userId) {
    throw new Error("Unauthorized");
  }

  // Date filter
  const dateFilter = {};

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0,0,0,0);
    dateFilter.gte = start;
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23,59,59,999);
    dateFilter.lte = end;
  }

  const attendanceRecords = await client.attendance.findMany({
    where: {
      studentId,
      ...(startDate || endDate ? { session: { date: dateFilter } } : {}),
    },
    select: {
    id: true,
    status: true,
    session: {
      select: {
        date: true,
      },
    },
  },

    orderBy: {
      session: {
        date: "desc",
      },
    },
  });

  if (!attendanceRecords.length) {
    return {
      message: "No attendance records found",
      history: [],
      summary: {},
    };
  }

  // Calculate summary
  let present = 0;
  let absent = 0;
  let late = 0;
  let leave = 0;
  let holiday = 0;

  for (const record of attendanceRecords) {
    switch (record.status) {
      case "PRESENT":
        present++;
        break;
      case "ABSENT":
        absent++;
        break;
      case "LATE":
        late++;
        break;
      case "LEAVE":
        leave++;
        break;
      case "HOLIDAY":
        holiday++;
        break;
    }
  }

  const totalDays = attendanceRecords.length;
  const attendancePercentage = totalDays > 0 ? (((present + late) / totalDays) * 100) : 0;

  return {
    message: "Attendance history fetched successfully",

    summary: {
      totalDays,
      present,
      absent,
      late,
      leave,
      holiday,
      attendancePercentage: attendancePercentage.toFixed(2),
    },

    history: attendanceRecords.map((record) => ({
      id: record.id,
      date: record.session.date,
      status: record.status,
    })),
  };
};


// update session for class
export const updateAttendanceSession = async (
  sessionId,
  exceptions,
  teacherId
) => {

  const session = await client.attendanceSession.findUnique({
    where: { id: sessionId },
    include: {
      class: {
        include: {
          students: {
            select: { id: true }
          }
        }
      }
    }
  });

  if (!session) {
    throw new Error("Attendance session not found");
  }

  if (session.teacherId !== teacherId) {
    throw new Error("Unauthorized");
  }

  const studentIds = new Set(session.class.students.map(s => s.id));
  const exceptionMap = new Map();

  const allowedStatuses = ["ABSENT", "LATE", "LEAVE", "HOLIDAY"];

  for (const item of exceptions) {

    if (!studentIds.has(item.studentId)) {
      throw new Error("Invalid student in exceptions");
    }

    if (exceptionMap.has(item.studentId)) {
      throw new Error("Duplicate student in exceptions");
    }

    if (!allowedStatuses.includes(item.status)) {
      throw new Error("Invalid attendance status");
    }

    exceptionMap.set(item.studentId, item.status);
  }

  await client.$transaction(async (tx) => {

    /* Reset everyone to PRESENT */

    await tx.attendance.updateMany({
      where: { sessionId },
      data: { status: "PRESENT" }
    });

    /* Apply exceptions */

    const updates = Array.from(exceptionMap.entries()).map(
      ([studentId, status]) =>
        tx.attendance.update({
          where: {
            sessionId_studentId: {
              sessionId,
              studentId
            }
          },
          data: { status }
        })
    );

    await Promise.all(updates);

  });

  return {
    message: "Attendance updated successfully"
  };
};

export const getClassAttendanceSummary = async (
  classId,
  userId,
  role
) => {
  // Authorization
  const classData = await client.class.findUnique({
    where: { id: classId },
    include: {
      students: true,
      attendanceSession: {
        include: {
          records: true,
        },
      },
    },
  });

  if (!classData) {
    throw new Error("Class not found");
  }

  // Teacher protection
  if (role === "teacher" && classData.teacherId !== userId) {
    throw new Error("Unauthorized");
  }

  const sessions = classData.attendanceSession;
  const totalSessions = sessions.length;

  const studentMap = {};

  classData.students.forEach((student) => {
    studentMap[student.id] = {
      id: student.id,
      studentName: student.studentName,
      rollNumber: student.rollNumber,
      present: 0,
      absent: 0,
      late: 0,
      leave: 0,
      holiday: 0,
    };
  });

  sessions.forEach((session) => {
    session.records.forEach((record) => {
      const s = studentMap[record.studentId];
      if (!s) return;

      switch (record.status) {
        case "PRESENT":
          s.present++;
          break;
        case "ABSENT":
          s.absent++;
          break;
        case "LATE":
          s.late++;
          break;
        case "LEAVE":
          s.leave++;
          break;
        case "HOLIDAY":
          s.holiday++;
          break;
      }
    });
  });

  const students = Object.values(studentMap).map((s) => {
    const percentage =
      totalSessions > 0
        ? ((s.present + s.late) / totalSessions) * 100
        : 0;

    return {
      ...s,
      attendancePercentage: percentage.toFixed(2),
    };
  });

  const averageAttendance =
    students.length > 0
      ? (
          students.reduce(
            (acc, s) => acc + Number(s.attendancePercentage),
            0
          ) / students.length
        ).toFixed(2)
      : 0;

  return {
    classSummary: {
      totalStudents: classData.students.length,
      totalSessions,
      averageAttendance,
    },
    students,
  };
};
