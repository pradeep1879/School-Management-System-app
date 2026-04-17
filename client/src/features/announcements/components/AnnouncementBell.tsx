import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAnnouncementRealtime } from "../hooks/useAnnouncementRealtime";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useAnnouncementStore } from "../store/announcement.store";
import { AnnouncementPanel } from "./AnnouncementPanel";

export const AnnouncementBell = () => {
  useAnnouncementRealtime();
  useAnnouncements();

  const unreadCount = useAnnouncementStore((state) => state.unreadCount);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-xl text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center rounded-full px-1 text-[10px]">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Announcements</SheetTitle>
          <SheetDescription>
            School updates arrive here instantly.
          </SheetDescription>
        </SheetHeader>
        <AnnouncementPanel compact className="min-h-0 flex-1 px-4 pb-4" />
      </SheetContent>
    </Sheet>
  );
};
