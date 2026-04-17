import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAnnouncementRead } from "../api/announcement.api";
import { useAnnouncementStore } from "../store/announcement.store";

export const useMarkAnnouncementRead = () => {
  const queryClient = useQueryClient();
  const markAsRead = useAnnouncementStore((state) => state.markAsRead);
  const markAsUnread = useAnnouncementStore((state) => state.markAsUnread);

  return useMutation({
    mutationFn: markAnnouncementRead,
    onMutate: (announcementId) => {
      const announcement = useAnnouncementStore
        .getState()
        .announcements.find((item) => item.id === announcementId);

      markAsRead(announcementId);

      return {
        wasUnread: announcement ? !announcement.isRead : false,
      };
    },
    onError: (_error, announcementId, context) => {
      if (context?.wasUnread) {
        markAsUnread(announcementId);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
};
