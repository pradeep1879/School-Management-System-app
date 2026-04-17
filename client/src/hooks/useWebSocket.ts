import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import type { WebSocketEnvelope } from "@/features/announcements/types/announcement.types";

type WebSocketHandlers = Record<string, (payload: unknown) => void>;

const getWebSocketUrl = (token: string) => {
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1";
  const baseUrl = String(apiUrl).replace(/\/api\/v1\/?$/, "").replace(/\/api\/?$/, "");
  const wsUrl = baseUrl.replace(/^http/, "ws");

  return `${wsUrl}?token=${encodeURIComponent(token)}`;
};

export const useWebSocket = (handlers: WebSocketHandlers) => {
  const token = useAuthStore((state) => state.token);
  const handlersRef = useRef(handlers);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const shouldReconnectRef = useRef(true);
  const [readyState, setReadyState] = useState<WebSocket["readyState"]>(
    WebSocket.CLOSED,
  );

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    if (!token) {
      return;
    }

    shouldReconnectRef.current = true;

    const connect = () => {
      const socket = new WebSocket(getWebSocketUrl(token));
      socketRef.current = socket;
      setReadyState(socket.readyState);

      socket.onopen = () => {
        reconnectAttemptsRef.current = 0;
        setReadyState(socket.readyState);
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketEnvelope;
          const handler = handlersRef.current[message.event];
          handler?.(message.payload);
        } catch {
          return;
        }
      };

      socket.onclose = () => {
        setReadyState(WebSocket.CLOSED);

        if (!shouldReconnectRef.current) {
          return;
        }

        const delay = Math.min(1000 * 2 ** reconnectAttemptsRef.current, 10000);
        reconnectAttemptsRef.current += 1;
        reconnectTimerRef.current = window.setTimeout(connect, delay);
      };

      socket.onerror = () => {
        socket.close();
      };
    };

    connect();

    return () => {
      shouldReconnectRef.current = false;

      if (reconnectTimerRef.current) {
        window.clearTimeout(reconnectTimerRef.current);
      }

      socketRef.current?.close();
      socketRef.current = null;
    };
  }, [token]);

  const send = (event: string, payload?: unknown) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ event, payload }));
      return true;
    }

    return false;
  };

  return {
    readyState,
    send,
  };
};
