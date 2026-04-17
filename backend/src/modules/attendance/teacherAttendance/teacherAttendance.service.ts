import { client } from "../../../prisma/db.ts";
import { getISTDate, getISTNow, getISTStartOfDay } from "../../../utils/date.ts";



// here teacher will submit the attendance 
export const submitTeacherAttendance = async (body, teacherId) => {

  const { status, note } = body;

  const allowedStatuses = [
    "PRESENT",
    "ABSENT",
    "LEAVE",
    "HALF_DAY",
    "HOLIDAY"
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid attendance status");
  }

  const attendanceDate = new Date(getISTDate());

  /* ---------- CHECK IF ALREADY SUBMITTED ---------- */

  const existingAttendance = await client.teacherAttendance.findUnique({
    where: {
      teacherId_date: {
        teacherId,
        date: attendanceDate
      }
    }
  });

  if (existingAttendance) {
    throw new Error("Attendance already submitted for today");
  }

  /* ---------- CREATE ATTENDANCE ---------- */

  const attendance = await client.teacherAttendance.create({
    data: {
      teacherId,
      date: attendanceDate,
      status,
      note,
      submittedById: teacherId
    }
  });

  return {
    message: "Attendance submitted successfully",
    attendance
  };
};


// pending status for admin
export const getPendingTeacherAttendance = async () => {
  return client.teacherAttendance.findMany({
    where: {
      approvalStatus: "PENDING",
    },
    select: {
      id: true,
      status: true,
      date: true,
      approvalStatus: true,
      note: true,
      submittedAt: true,
      teacher: {
        select: {
          id: true,
          teacherName: true,
          email: true,
        },
      },
    },
    orderBy: {
      submittedAt: "desc",
    },
  });
};



// here admin will approve the status of attendance
export const approveTeacherAttendance = async (attendanceId, adminId) => {

  const attendance = await client.teacherAttendance.updateMany({
    where: {
      id: attendanceId,
      approvalStatus: "PENDING"
    },
    data: {
      approvalStatus: "APPROVED",
      verifiedBy: adminId,
      verifiedAt: getISTNow()
    }
  })

  if (attendance.count === 0) {
    throw new Error("Attendance not found or already processed")
  }

  return {
    message: "Attendance approved successfully"
  }
}

// admin can reject the status of attendance
export const rejectTeacherAttendance = async (
  attendanceId,
  adminId,
  reason
) => {

  const attendance = await client.teacherAttendance.updateMany({
    where: {
      id: attendanceId,
      approvalStatus: "PENDING"
    },
    data: {
      approvalStatus: "REJECTED",
      verifiedBy: adminId,
      verifiedAt: getISTNow(),
      rejectionReason: reason
    }
  })

  if (attendance.count === 0) {
    throw new Error("Attendance not found or already processed")
  }

  return {
    message: "Attendance rejected successfully"
  }
}

// teacher attendance history for admin
export const getTeacherAttendanceHistoryById = async (teacherId) => {
  return client.teacherAttendance.findMany({
    where: {
      teacherId,
    },
    orderBy: {
      date: "desc",
    },
    take: 50
  });
};;


export const getTodayAttendance = async (teacherId) => {

  const today = new Date(getISTDate())


  return client.teacherAttendance.findUnique({
    where: {
      teacherId_date: {
        teacherId,
        date: today
      }
    },
    select: {
      id: true,
      status: true,
      approvalStatus: true,
      rejectionReason: true,
      date: true
    }
  })
}

// get teacher attendance
export const getMyTeacherAttendance = async (teacherId) => {
  const attendance = await client.teacherAttendance.findMany({
    where: {
      teacherId,
    },
    orderBy: {
      date: "desc",
    },
  });

  return attendance;
};


// get all teachers attendance history
export const getAllTeacherAttendanceHistory = async () => {
  return client.teacherAttendance.findMany({
    include: {
      teacher: {
        select: {
          id: true,
          teacherName: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
    take: 100
  });
};



export const getTeacherAttendanceStats = async () => {

  const teachers = await client.teacher.findMany({
    select: {
      id: true,
      teacherName: true
    }
  });

  const attendanceCounts = await client.teacherAttendance.groupBy({
    by: ["teacherId", "status"],
    _count: {
      status: true
    }
  });

  const map = {};

  attendanceCounts.forEach((a) => {

    if (!map[a.teacherId]) {
      map[a.teacherId] = {
        PRESENT: 0,
        ABSENT: 0,
        LEAVE: 0,
        HALF_DAY: 0
      };
    }

    map[a.teacherId][a.status] = a._count.status;

  });

  return teachers.map((teacher) => {

    const stats = map[teacher.id] || {
      PRESENT: 0,
      ABSENT: 0,
      LEAVE: 0,
      HALF_DAY: 0
    };

    const total =
      stats.PRESENT +
      stats.ABSENT +
      stats.LEAVE +
      stats.HALF_DAY;

    const attendancePercent = total
      ? Math.round((stats.PRESENT / total) * 100)
      : 0;

    return {
      teacherId: teacher.id,
      teacherName: teacher.teacherName,
      present: stats.PRESENT,
      absent: stats.ABSENT,
      leave: stats.LEAVE,
      halfDay: stats.HALF_DAY,
      attendancePercent
    };

  });

};