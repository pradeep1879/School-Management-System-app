import { useMemo } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAnnouncementStore } from "../store/announcement.store";
import type { Announcement } from "../types/announcement.types";

export const useAnnouncementRealtime = () => {
  const addAnnouncementRealtime = useAnnouncementStore(
    (state) => state.addAnnouncementRealtime,
  );
  const markAsRead = useAnnouncementStore((state) => state.markAsRead);

  const handlers = useMemo(
    () => ({
      ANNOUNCEMENT_RECEIVED: (payload: unknown) => {
        addAnnouncementRealtime(payload as Announcement);
      },
      ANNOUNCEMENT_READ: (payload: unknown) => {
        const readPayload = payload as { announcementId?: string };

        if (readPayload.announcementId) {
          markAsRead(readPayload.announcementId);
        }
      },
    }),
    [addAnnouncementRealtime, markAsRead],
  );

  return useWebSocket(handlers);
};
