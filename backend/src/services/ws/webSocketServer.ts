import type { Server } from "http";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { joinRoom, leaveRoom, removeSocket } from "./roomManager.ts";
import config from "../../../config.ts";
import type { JwtUserPayload } from "../../types/auth.types";

export const startWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (ws, req) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      const token = url.searchParams.get("token");

      if (!token) {
        ws.close();
        return;
      }

      const decoded = jwt.verify(
        token,
        config.JWT_SECRET as string,
      ) as JwtUserPayload;

      ws.user = decoded;

      // automatically join rooms
      if (decoded.classId) {
        joinRoom(ws, decoded.classId);
      }

      joinRoom(ws, `user_${decoded.id}`);
    } catch (error) {
      void error;
      ws.close();
      return;
    }

    ws.on("message", (data) => {
      let message;

      try {
        message = JSON.parse(data.toString());
      } catch {
        return;
      }

      const { event, room } = message;

      if (event === "leave_room") {
        leaveRoom(ws, room);
      }
    });

    ws.on("close", () => {
      removeSocket(ws);
    });
  });
};
