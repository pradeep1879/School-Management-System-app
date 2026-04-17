import type { Server } from "http";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import config from "../../config.ts";
import { client } from "../prisma/db.ts";
import type { AppRole, JwtUserPayload } from "../types/auth.types";
import { joinRoom, leaveRoom, removeSocket } from "../services/ws/roomManager.ts";
import { registerClient, unregisterClient } from "./wsClients.ts";

const getClientClassId = async (userId: string, role: AppRole, tokenClassId?: string | null) => {
  if (tokenClassId) {
    return tokenClassId;
  }

  if (role === "student") {
    const student = await client.student.findUnique({
      where: { id: userId },
      select: { classId: true },
    });

    return student?.classId ?? null;
  }

  if (role === "teacher") {
    const teacherClass = await client.class.findFirst({
      where: { teacherId: userId },
      select: { id: true },
    });

    return teacherClass?.id ?? null;
  }

  return null;
};

export const startWebSocket = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", async (ws, req) => {
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

      const classId = await getClientClassId(decoded.id, decoded.role, decoded.classId);
      ws.user = { ...decoded, classId };

      registerClient(ws, {
        userId: decoded.id,
        role: decoded.role,
        classId,
      });

      if (classId) {
        joinRoom(ws, classId);
      }

      joinRoom(ws, `user_${decoded.id}`);
    } catch (error) {
      void error;
      ws.close();
      return;
    }

    ws.on("message", (data) => {
      let message: { event?: string; room?: string };

      try {
        message = JSON.parse(data.toString()) as { event?: string; room?: string };
      } catch {
        return;
      }

      if (message.event === "leave_room" && message.room) {
        leaveRoom(ws, message.room);
      }
    });

    ws.on("close", () => {
      unregisterClient(ws);
      removeSocket(ws);
    });
  });
};
