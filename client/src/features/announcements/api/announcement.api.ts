import api from "@/api/axios";
import type {
  AnnouncementCreateResponse,
  AnnouncementListResponse,
  CreateAnnouncementPayload,
} from "../types/announcement.types";

export const getAnnouncements = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const res = await api.get<AnnouncementListResponse>("/announcements", {
    params,
  });

  return res.data;
};

export const createAnnouncement = async (data: CreateAnnouncementPayload) => {
  const res = await api.post<AnnouncementCreateResponse>("/announcements", data);
  return res.data;
};

export const markAnnouncementRead = async (announcementId: string) => {
  const res = await api.patch(`/announcements/${announcementId}/read`);
  return res.data;
};
