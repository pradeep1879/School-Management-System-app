// @ts-nocheck
import type { WebSocket } from "ws";

const rooms = new Map<string, Set<WebSocket>>();
const socketRooms = new Map<WebSocket, Set<string>>();

export const joinRoom = (socket, room) => {

  if (!rooms.has(room)) {
    rooms.set(room, new Set());
  }

  rooms.get(room).add(socket);

  if (!socketRooms.has(socket)) {
    socketRooms.set(socket, new Set());
  }

  socketRooms.get(socket).add(room);
};

export const leaveRoom = (socket, room) => {

  if (rooms.has(room)) {
    rooms.get(room).delete(socket);

    if (rooms.get(room).size === 0) {
      rooms.delete(room);
    }
  }

  if (socketRooms.has(socket)) {
    socketRooms.get(socket).delete(room);
  }
};

export const broadcastToRoom = (room, message) => {

  const clients = rooms.get(room);

  if (!clients) return;

  clients.forEach((client) => {

    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }

  });

};

export const removeSocket = (socket) => {

  const joinedRooms = socketRooms.get(socket);

  if (!joinedRooms) return;

  joinedRooms.forEach((room) => {
    leaveRoom(socket, room);
  });

  socketRooms.delete(socket);
};
