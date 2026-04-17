import type { WebSocket } from "ws";
import type { AppRole } from "../types/auth.types";
import { WS_EVENTS, type AnnouncementRealtimePayload, type WsServerMessage } from "./wsEvents.ts";

export type ConnectedClient = {
  userId: string;
  role: AppRole;
  classId?: string | null;
};

const sockets = new Map<WebSocket, ConnectedClient>();
const socketsByUser = new Map<string, Set<WebSocket>>();

const sendJson = <TPayload>(socket: WebSocket, message: WsServerMessage<TPayload>) => {
  if (socket.readyState !== socket.OPEN) {
    return;
  }

  socket.send(JSON.stringify(message));
};

export const registerClient = (socket: WebSocket, client: ConnectedClient) => {
  sockets.set(socket, client);

  if (!socketsByUser.has(client.userId)) {
    socketsByUser.set(client.userId, new Set());
  }

  socketsByUser.get(client.userId)?.add(socket);
};

export const unregisterClient = (socket: WebSocket) => {
  const client = sockets.get(socket);

  if (client) {
    const userSockets = socketsByUser.get(client.userId);
    userSockets?.delete(socket);

    if (userSockets?.size === 0) {
      socketsByUser.delete(client.userId);
    }
  }

  sockets.delete(socket);
};

export const sendToUser = <TPayload>(
  userId: string,
  message: WsServerMessage<TPayload>,
) => {
  socketsByUser.get(userId)?.forEach((socket) => sendJson(socket, message));
};

export const sendToMatchingClients = <TPayload>(
  predicate: (client: ConnectedClient) => boolean,
  message: WsServerMessage<TPayload>,
) => {
  sockets.forEach((client, socket) => {
    if (predicate(client)) {
      sendJson(socket, message);
    }
  });
};

export const emitAnnouncementToTargets = (
  announcement: AnnouncementRealtimePayload,
  predicate: (client: ConnectedClient) => boolean,
  getPayload?: (client: ConnectedClient) => AnnouncementRealtimePayload,
) => {
  sockets.forEach((client, socket) => {
    if (!predicate(client)) {
      return;
    }

    sendJson(socket, {
      event: WS_EVENTS.ANNOUNCEMENT_RECEIVED,
      payload: getPayload?.(client) ?? announcement,
    });
  });
};

export const getConnectedClients = () => Array.from(sockets.values());
