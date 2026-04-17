import type { AppRole } from "./auth.types";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: AppRole;
    }
  }
}

export {};
