let socket: WebSocket | null = null;

const apiUrl = import.meta.env.VITE_API_URL as string | undefined;

const socketBaseUrl = (() => {
  if (!apiUrl) {
    return "ws://localhost:3001";
  }

  const url = new URL(apiUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "";
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/$/, "");
})();

export const connectSocket = (token: string) => {
  socket = new WebSocket(`${socketBaseUrl}?token=${token}`);
  return socket;
};

export const getSocket = () => socket;
