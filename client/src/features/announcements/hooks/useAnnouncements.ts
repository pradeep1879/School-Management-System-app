import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAnnouncements } from "../api/announcement.api";
import { useAnnouncementStore } from "../store/announcement.store";

export const useAnnouncements = () => {
  const setAnnouncements = useAnnouncementStore((state) => state.setAnnouncements);

  const query = useQuery({
    queryKey: ["announcements"],
    queryFn: () => getAnnouncements({ page: 1, limit: 30 }),
    staleTime: 1000 * 30,
  });

  useEffect(() => {
    if (query.data) {
      setAnnouncements(query.data.announcements, query.data.unreadCount);
    }
  }, [query.data, setAnnouncements]);

  return query;
};
