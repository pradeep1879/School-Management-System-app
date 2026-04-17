
import { Bell } from "lucide-react";
import { useNotificationContext } from "../context/NotificationContext";
import NotificationItem from "../components/NotificationItem";


const StudentNotificationPage = () => {

  const { notification } = useNotificationContext();

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Bell className="w-5 h-5 text-primary" />
        </div>

        <div>
          <h1 className="text-xl font-semibold">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Stay updated with your academic activities
          </p>
        </div>
      </div>

      {/* LIST */}
      <div className="bg-card border rounded-xl divide-y">

        {notification?.length === 0 && (
          <div className="p-10 text-center text-muted-foreground">
            No notifications yet
          </div>
        )}

        {notification?.map((n, i) => (
          <NotificationItem key={i} notification={n} />
        ))}

      </div>

    </div>
  );
};

export default StudentNotificationPage;