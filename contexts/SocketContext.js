import React, { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import Constants from "expo-constants";

export const SocketContext = createContext(null);
const BACKEND_URL = Constants.expoConfig.extra.BACKEND_URL;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(BACKEND_URL, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
