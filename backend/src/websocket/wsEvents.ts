import type { AppRole } from "../types/auth.types";

export const WS_EVENTS = {
  ANNOUNCEMENT_CREATED: "ANNOUNCEMENT_CREATED",
  ANNOUNCEMENT_RECEIVED: "ANNOUNCEMENT_RECEIVED",
  ANNOUNCEMENT_READ: "ANNOUNCEMENT_READ",
} as const;

export type WsEventName = (typeof WS_EVENTS)[keyof typeof WS_EVENTS];

export type AnnouncementTargetType = "SCHOOL" | "CLASS" | "TEACHERS";

export type AnnouncementRealtimePayload = {
  id: string;
  title: string;
  message: string;
  senderId: string;
  senderRole: AppRole;
  targetType: AnnouncementTargetType;
  classId: string | null;
  createdAt: Date | string;
  isRead?: boolean;
};

export type WsServerMessage<TPayload = unknown> = {
  event: WsEventName | string;
  payload?: TPayload;
};
