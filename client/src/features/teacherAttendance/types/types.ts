export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  approvalStatus: string;
  note?: string | null;
}