import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
// load reducers
import { useSelector } from "react-redux";

export const SocketContext = createContext(null);
const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const SocketProvider = ({ children }) => {
  const gameID = useSelector((state) => state.game.value.gameID);
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
      console.log("🛑 Disconnecting socket:", socket?.id);
      newSocket.disconnect();
    };
  }, [EXPO_PUBLIC_BACKEND_URL, gameID]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
