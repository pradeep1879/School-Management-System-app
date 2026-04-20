export interface AttendanceStats {
  PRESENT: number
  ABSENT: number
  LEAVE: number
  HOLIDAY: number
}

export interface TeacherAttendanceStats extends AttendanceStats {
  HALF_DAY: number
}

export interface WeeklyAttendance {
  date: string
  studentsPresent: number
  teachersPresent: number
}




export interface DashboardAnalytics {

  overview: {
    totalClasses: number
    totalTeachers: number
    totalStudents: number
  }

  todayAttendance: {
    students: AttendanceStats
    teachers: TeacherAttendanceStats
  }

  attendanceStatus: {
    classesMarked: number
    pendingClasses: number
  }

  charts: {
    weeklyAttendance: WeeklyAttendance[]
  }

}


export interface DailyAttendance {
  date: string
  studentsPresent: number
  teachersPresent: number
}
