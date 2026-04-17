import { Bell, BookOpen, ClipboardList, GraduationCap } from "lucide-react";

interface Notification {
  id?: string;
  type?: string;
  title: string;
  message?: string;
  createdAt?: string;
  isRead?: boolean;
}

const getIcon = (type?: string) => {
  switch (type) {
    case "exam_created":
      return <GraduationCap className="w-5 h-5 text-purple-500" />;
    case "homework_created":
      return <BookOpen className="w-5 h-5 text-blue-500" />;
    case "activity_added":
      return <ClipboardList className="w-5 h-5 text-green-500" />;
    default:
      return <Bell className="w-5 h-5 text-gray-500" />;
  }
};

const NotificationItem = ({ notification }: { notification: Notification }) => {

  return (
    <div
      className={`flex items-start gap-4 p-4 transition hover:bg-muted/50
        ${!notification.isRead ? "bg-primary/5" : ""}
      `}
    >

      {/* ICON */}
      <div className="mt-1">
        {getIcon(notification.type)}
      </div>

      {/* CONTENT */}
      <div className="flex-1 space-y-1">

        <div className="flex items-center justify-between">
          <p className="font-medium text-sm">
            {notification.title}
          </p>

          {!notification.isRead && (
            <span className="w-2 h-2 bg-primary rounded-full"></span>
          )}
        </div>

        {notification.message && (
          <p className="text-sm text-muted-foreground">
            {notification.message}
          </p>
        )}

        {notification.createdAt && (
          <p className="text-xs text-muted-foreground">
            {new Date(notification.createdAt).toLocaleString()}
          </p>
        )}

      </div>

    </div>
  );
};

export default NotificationItem;