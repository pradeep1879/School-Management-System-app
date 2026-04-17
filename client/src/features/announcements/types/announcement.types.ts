export type AnnouncementTargetType = "SCHOOL" | "CLASS" | "TEACHERS";
export type AnnouncementRole = "admin" | "teacher" | "student";

export type Announcement = {
  id: string;
  title: string;
  message: string;
  senderId: string;
  senderRole: AnnouncementRole;
  senderName?: string;
  targetType: AnnouncementTargetType;
  classId: string | null;
  createdAt: string;
  isRead: boolean;
};

export type CreateAnnouncementPayload = {
  title: string;
  message: string;
  targetType: AnnouncementTargetType;
  classId?: string | null;
};

export type AnnouncementListResponse = {
  success: boolean;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  unreadCount: number;
  announcements: Announcement[];
};

export type AnnouncementCreateResponse = {
  success: boolean;
  message: string;
  announcement: Announcement;
};

export type WebSocketEnvelope<TPayload = unknown> = {
  event: string;
  payload?: TPayload;
};
