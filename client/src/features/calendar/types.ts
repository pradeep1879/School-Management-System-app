export type CalendarEventItem = {
  id: string;
  title: string;
  description?: string | null;
  startDate: string;
  endDate: string;
  type: "HOLIDAY" | "EXAM" | "EVENT" | "NOTICE";
  classId?: string | null;
  createdAt: string;
  updatedAt: string;
  class?: {
    id: string;
    slug: string;
    section: string;
    session: string;
  } | null;
  admin: {
    id: string;
    name: string;
    email: string;
  };
};
