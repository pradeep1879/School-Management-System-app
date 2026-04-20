import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { getAnnouncements } from "../api/announcement.api";
import { useAnnouncementStore } from "../store/announcement.store";

export const useAnnouncements = () => {
  const role = useAuthStore((state) => state.role);
  const userId = useAuthStore((state) => state.userId);
  const setAnnouncements = useAnnouncementStore((state) => state.setAnnouncements);

  const query = useQuery({
    queryKey: ["announcements", role, userId],
    queryFn: () => getAnnouncements({ page: 1, limit: 30 }),
    staleTime: 1000 * 30,
    enabled: Boolean(role && userId),
  });

  useEffect(() => {
    if (query.data) {
      setAnnouncements(query.data.announcements, query.data.unreadCount);
    }
  }, [query.data, setAnnouncements]);

  return query;
};
