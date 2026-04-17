import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAnnouncement } from "../api/announcement.api";
import { useAnnouncementStore } from "../store/announcement.store";

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  const addAnnouncementRealtime = useAnnouncementStore(
    (state) => state.addAnnouncementRealtime,
  );

  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: (data) => {
      addAnnouncementRealtime({ ...data.announcement, isRead: true });
      void queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
};
