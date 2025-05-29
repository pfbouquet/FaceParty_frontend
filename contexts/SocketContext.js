import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null);
const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(EXPO_PUBLIC_BACKEND_URL, {
      transports: ["websocket"],
    });

    console.log("url =>", EXPO_PUBLIC_BACKEND_URL);

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    return () => {
      console.log("🛑 Socket disconnected:", newSocket.id);
      newSocket.emit("disconnect");
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
