export interface DashboardStudentProfile {
  id: string;
  studentName: string;
  userName: string;
  imageUrl?: string | null;
  rollNumber: string;
  gender: string;
  contactNo: string;
  classId: string;
  class: {
    id: string;
    slug: string;
    section: string;
    session: string;
  };
}

export interface AttendanceHeatmapCell {
  date: string;
  status: string;
  value: number;
}

export interface DashboardUpcomingItem {
  id: string;
  title: string;
  type: "exam" | "homework";
  date: string;
  status: string;
  meta: string;
  url: string;
}

export interface DashboardActivityItem {
  id: string;
  type: "result" | "announcement";
  title: string;
  description: string;
  date: string;
  url: string;
}

export interface DashboardSubjectPerformance {
  subject: string;
  averageMarks: number;
  classAverage: number;
  latestScore: number;
}

export interface DashboardTrendPoint {
  examId: string;
  examTitle: string;
  date: string;
}

export interface DashboardPerformancePoint extends DashboardTrendPoint {
  studentMarks: number;
  classAverage: number;
}

export interface DashboardRankPoint extends DashboardTrendPoint {
  rank: number | null;
}

export interface StudentDashboardSummary {
  student: DashboardStudentProfile;
  attendance: {
    percentage: number;
    attendedCount: number;
    totalCount: number;
    trend: number;
    heatmap: AttendanceHeatmapCell[];
  };
  avgMarks: number;
  rank: number | null;
  quickStats: {
    attendance: number;
    upcomingExams: number;
    pendingHomework: number;
    latestRank: number | null;
    avgMarks: number;
    completedAssignments: number;
    latestQuizScore: number;
  };
  trends: {
    performanceOverview: DashboardPerformancePoint[];
    rankTrend: DashboardRankPoint[];
    marksTrend: number;
    rankTrendDelta: number;
  };
  subjectPerformance: DashboardSubjectPerformance[];
  upcoming: DashboardUpcomingItem[];
  recentActivity: DashboardActivityItem[];
  insights: {
    weakSubjects: string[];
    suggestedAction: string;
    recommendedQuizTopic: string;
  };
}

export interface StudentDashboardResponse {
  success: boolean;
  summary: StudentDashboardSummary;
}
