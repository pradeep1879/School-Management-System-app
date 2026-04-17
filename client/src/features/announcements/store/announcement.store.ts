import { create } from "zustand";
import type { Announcement } from "../types/announcement.types";

type AnnouncementState = {
  announcements: Announcement[];
  unreadCount: number;
  setAnnouncements: (announcements: Announcement[], unreadCount?: number) => void;
  addAnnouncementRealtime: (announcement: Announcement) => void;
  markAsRead: (announcementId: string) => void;
  markAsUnread: (announcementId: string) => void;
};

export const useAnnouncementStore = create<AnnouncementState>((set) => ({
  announcements: [],
  unreadCount: 0,

  setAnnouncements: (announcements, unreadCount) =>
    set({
      announcements,
      unreadCount:
        unreadCount ??
        announcements.filter((announcement) => !announcement.isRead).length,
    }),

  addAnnouncementRealtime: (announcement) =>
    set((state) => {
      const exists = state.announcements.some((item) => item.id === announcement.id);

      if (exists) {
        return state;
      }

      return {
        announcements: [announcement, ...state.announcements],
        unreadCount: announcement.isRead
          ? state.unreadCount
          : state.unreadCount + 1,
      };
    }),

  markAsRead: (announcementId) =>
    set((state) => {
      const announcement = state.announcements.find((item) => item.id === announcementId);

      return {
        announcements: state.announcements.map((item) =>
          item.id === announcementId ? { ...item, isRead: true } : item,
        ),
        unreadCount:
          announcement && !announcement.isRead
            ? Math.max(state.unreadCount - 1, 0)
            : state.unreadCount,
      };
    }),

  markAsUnread: (announcementId) =>
    set((state) => {
      const announcement = state.announcements.find((item) => item.id === announcementId);

      return {
        announcements: state.announcements.map((item) =>
          item.id === announcementId ? { ...item, isRead: false } : item,
        ),
        unreadCount:
          announcement?.isRead === true
            ? state.unreadCount + 1
            : state.unreadCount,
      };
    }),
}));
