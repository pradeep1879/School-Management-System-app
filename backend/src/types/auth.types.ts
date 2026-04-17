import type { JwtPayload } from "jsonwebtoken";

export type AppRole = "admin" | "teacher" | "student";

export interface JwtUserPayload extends JwtPayload {
  id: string;
  role: AppRole;
  classId?: string | null;
}
