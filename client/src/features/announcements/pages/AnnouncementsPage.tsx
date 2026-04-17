import { AnnouncementForm } from "../components/AnnouncementForm";
import { AnnouncementPanel } from "../components/AnnouncementPanel";
import { useAuthStore } from "@/store/auth.store";

const roleCopy = {
  admin: {
    eyebrow: "Announcements",
    title: "School communication",
    description:
      "Send announcements to the whole school, a specific class, or only teachers.",
  },
  teacher: {
    eyebrow: "Announcements",
    title: "Class communication",
    description:
      "Teacher announcements are routed only to students in your assigned class.",
  },
  student: {
    eyebrow: "Announcements",
    title: "School updates",
    description:
      "Read admin and teacher announcements separately, with unread updates highlighted.",
  },
} as const;

const AnnouncementsPage = () => {
  const role = useAuthStore((state) => state.role);
  const copy = roleCopy[role ?? "student"];

  return (
    <div className="space-y-6 ">
      <div className="rounded-3xl border bg-card p-6 shadow-sm md:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {copy.eyebrow}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {copy.title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
            {copy.description}
          </p>
        </div>
      </div>

      {role !== "student" && <AnnouncementForm />}

      <div className="rounded-3xl border bg-card p-4 shadow-sm">
        <AnnouncementPanel className="max-h-[78vh]" />
      </div>
    </div>
  );
};

export default AnnouncementsPage;
