/**
 * Fournit une connexion WebSocket à toute l'application via socket.io.
 * Ce contexte permet d'accéder au socket depuis n'importe quel composant. context = mécanique pour partager des données dans tous les composants facilement
 * SocketContext englobe toute l'app dans app.js
 */

import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext(null); // Création du contexte pour exposer le socket dans l'app
const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null); // stocke l'instance de socket. instance = objet socket comme envoyer un évènement ou encore écouter un socket

  useEffect(() => {
    const newSocket = io(EXPO_PUBLIC_BACKEND_URL, {
      transports: ["websocket"],
    });

    console.log("url =>", EXPO_PUBLIC_BACKEND_URL);
    setSocket(newSocket);// Mise à jour du state avec l'instance de socket

    // Log une fois que le socket est connecté
    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
    });

    // Nettoyage à la désactivation du provider ou démontage du composant
    return () => {
      console.log("🛑 Socket disconnected:", newSocket.id);
      newSocket.emit("disconnect"); // Envoie un event de déconnexion
      newSocket.disconnect(); // Ferme la connexion socket
    };
  }, []);

  // Fournit l'instance du socket à tous les composants enfants via le context
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
