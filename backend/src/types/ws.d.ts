import type { JwtUserPayload } from "./auth.types";

declare module "ws" {
  interface WebSocket {
    user?: JwtUserPayload;
  }
}
