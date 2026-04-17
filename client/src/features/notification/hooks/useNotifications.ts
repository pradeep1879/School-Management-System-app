import { useEffect } from "react";
import { useNotificationContext } from "../context/NotificationContext"
import { useAuthStore } from "@/store/auth.store";
import { connectSocket } from "../services/socket";


export const useNotifications = () =>{
  const { addNotification } = useNotificationContext();
  const token = useAuthStore((state) => state.token);

  useEffect(() =>{
    if (!token) {
      return;
    }

    const socket = connectSocket(token);

    socket.onopen = () =>{
      console.log("Websocket connected")
    }

    socket.onmessage = (event:any) =>{
      const message = JSON.parse(event.data);

      addNotification(message);
    };

    socket.onclose = () =>{
      console.log("Websocket disconnected");
    }

    return () => socket.close();
  }, [addNotification, token]);
}
