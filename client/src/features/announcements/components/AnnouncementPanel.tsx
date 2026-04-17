import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Crown, GraduationCap, Inbox, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAnnouncements } from "../hooks/useAnnouncements";
import { useMarkAnnouncementRead } from "../hooks/useMarkAnnouncementRead";
import { useAnnouncementStore } from "../store/announcement.store";

type AnnouncementPanelProps = {
  className?: string;
  compact?: boolean;
};

const targetLabel = {
  SCHOOL: "School",
  CLASS: "Class",
  TEACHERS: "Teachers",
} as const;

const senderMeta = {
  admin: {
    label: "Admin",
    icon: Crown,
    badgeClass: "border-border bg-muted text-foreground",
    cardClass: "bg-card",
  },
  teacher: {
    label: "Teacher",
    icon: GraduationCap,
    badgeClass: "border-border bg-muted text-foreground",
    cardClass: "bg-card",
  },
  student: {
    label: "Student",
    icon: Inbox,
    badgeClass: "border-border bg-muted text-foreground",
    cardClass: "bg-card",
  },
} as const;

type FilterKey = "all" | "unread" | "admin" | "teacher";

export const AnnouncementPanel = ({ className, compact = false }: AnnouncementPanelProps) => {
  const { isLoading } = useAnnouncements();
  const announcements = useAnnouncementStore((state) => state.announcements);
  const markReadMutation = useMarkAnnouncementRead();
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const counts = useMemo(
    () => ({
      all: announcements.length,
      unread: announcements.filter((announcement) => !announcement.isRead).length,
      admin: announcements.filter((announcement) => announcement.senderRole === "admin").length,
      teacher: announcements.filter((announcement) => announcement.senderRole === "teacher").length,
    }),
    [announcements],
  );

  const filteredAnnouncements = useMemo(() => {
    if (activeFilter === "unread") {
      return announcements.filter((announcement) => !announcement.isRead);
    }

    if (activeFilter === "admin" || activeFilter === "teacher") {
      return announcements.filter(
        (announcement) => announcement.senderRole === activeFilter,
      );
    }

    return announcements;
  }, [activeFilter, announcements]);

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: counts.all },
    { key: "unread", label: "Unread", count: counts.unread },
    { key: "admin", label: "Admin", count: counts.admin },
    { key: "teacher", label: "Teacher", count: counts.teacher },
  ];

  const handleMarkAsRead = (announcementId: string) => {
    if (!markReadMutation.isPending) {
      markReadMutation.mutate(announcementId);
    }
  };

  if (isLoading && announcements.length === 0) {
    return (
      <div className={cn("rounded-xl border bg-card p-5", className)}>
        <div className="h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-4 space-y-3">
          <div className="h-24 animate-pulse rounded-xl bg-muted/80" />
          <div className="h-24 animate-pulse rounded-xl bg-muted/60" />
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className={cn("rounded-2xl border bg-card p-8 text-center", className)}>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="font-semibold">No announcements yet</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          New announcements will appear here in real time.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col overflow-hidden", className)}>
      {!compact && (
        <div className="grid gap-3 pb-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground">Total</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{counts.all}</p>
          </div>
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground">Unread</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{counts.unread}</p>
          </div>
          <div className="rounded-2xl border bg-card p-4 shadow-sm">
            <p className="text-xs font-medium text-muted-foreground">Teacher updates</p>
            <p className="mt-1 text-2xl font-semibold text-foreground">{counts.teacher}</p>
          </div>
        </div>
      )}

      <div className="custom-div-scroll mb-4 flex gap-2 pb-1">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            type="button"
            size="sm"
            variant={activeFilter === filter.key ? "default" : "outline"}
            className="shrink-0 rounded-full"
            onClick={() => setActiveFilter(filter.key)}
          >
            {filter.label}
            <Badge
              variant={activeFilter === filter.key ? "secondary" : "outline"}
              className="ml-2 rounded-full px-1.5"
            >
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>

      {filteredAnnouncements.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground">
          No {activeFilter} announcements found.
        </div>
      ) : (
        <div className="custom-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
          {filteredAnnouncements.map((announcement) => {
            const meta = senderMeta[announcement.senderRole];
            const SenderIcon = meta.icon;
            const isPendingCurrent =
              markReadMutation.isPending &&
              markReadMutation.variables === announcement.id;

            return (
              <Card
                key={announcement.id}
                className={cn(
                  "overflow-hidden border shadow-sm transition-colors hover:bg-muted/30",
                  meta.cardClass,
                  !announcement.isRead && "border-primary/50 ring-1 ring-primary/20",
                )}
                onClick={() => {
                  if (!announcement.isRead) {
                    handleMarkAsRead(announcement.id);
                  }
                }}
              >
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border bg-muted/50">
                        <SenderIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold leading-tight">
                      {announcement.title}
                    </h3>
                    {!announcement.isRead && (
                            <Badge className="rounded-full">New</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {announcement.senderName ?? announcement.senderRole} ·{" "}
                    {formatDistanceToNow(new Date(announcement.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <Badge variant="outline" className={cn("rounded-full", meta.badgeClass)}>
                        {meta.label}
                      </Badge>
                <Badge variant="outline">
                  {targetLabel[announcement.targetType]}
                </Badge>
                    </div>
              </div>

              <p className="whitespace-pre-line text-sm text-foreground/85">
                {announcement.message}
              </p>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs text-muted-foreground">
                      {announcement.isRead ? "Read" : "Tap card or button to mark read"}
                    </span>
                    {!announcement.isRead ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={isPendingCurrent}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleMarkAsRead(announcement.id);
                        }}
                      >
                        {isPendingCurrent ? "Saving..." : "Mark as read"}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-emerald-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Read
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
