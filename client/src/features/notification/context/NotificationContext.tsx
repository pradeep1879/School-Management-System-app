import { createContext, useContext, useState } from "react";

interface Notification{
  title:string;
}

interface NotificationContextP {
  notification?: Notification[];
  addNotification:(notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextP | undefined>(undefined);

export const NotificationProvider = ({children}: {children:React.ReactNode}) =>{
  const [notification, setNotification] = useState<Notification []>([])

  const addNotification = (notification:Notification) =>{
    setNotification((prev) => [notification, ...prev])
  };

  return (
    <NotificationContext.Provider
    value={{notification, addNotification}}
    >
      {children}
    </NotificationContext.Provider>
  )
}


export const useNotificationContext = () =>{
  const context = useContext(NotificationContext);
  if(!context){
    throw new Error("useNotificationContext must be used inside NotificationProvider")
  }

  return context;
}