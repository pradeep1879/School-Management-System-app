export type TimetableSlot = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string | null;
  createdAt: string;
  class: {
    id: string;
    slug: string;
    section: string;
    session: string;
  };
  subject: {
    id: string;
    name: string;
    code?: string | null;
    room?: number | null;
  };
  teacher: {
    id: string;
    teacherName: string;
    email?: string | null;
    imageUrl?: string | null;
  };
};

export type TimetableResponse = {
  success: boolean;
  class?: {
    id: string;
    slug: string;
    section: string;
    session: string;
  };
  slots: TimetableSlot[];
};
