/**
 * Écran pour créer une nouvelle partie multijoueur (admin)
 * - Crée la partie côté backend via API
 * - Rejoint ensuite cette partie en tant qu'admin via socket
 * - Met à jour les reducers game et player avec les données reçues
 * - Navigue vers l'écran PlayerName une fois prêt
 */

import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

// import game and player reducers
import { useDispatch } from "react-redux";
import { newGame } from "../reducers/game";
import { newPlayer } from "../reducers/player";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function NewMultiGame({ navigation }) {
  const socket = useContext(SocketContext);
  const [statusText, setStatusText] = useState("");
  const dispatch = useDispatch();

  // Au chargement du composant, crée et rejoint une nouvelle partie
  useEffect(() => {
    if (!socket) return;
    adminCreateGame();
  }, []);

  // Crée une partie en appelant l'API backend
  async function createGame(nbRound = 6) {
    setStatusText("Create game in backend ...");
    let response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/games/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nbRound: nbRound,
      }),
    });
    let data = await response.json();

    if (data.result) {
      // Mise à jour du reducer game avec la partie créée
      setStatusText(`Got a new game code: ${data.game.roomID}`);
      dispatch(
        newGame({
          gameID: data.game.gameID,
          roomID: data.game.roomID,
          nbRound: data.game.nbRound,
        })
      );
      // console.log("Game created:", data.game.roomID);
      return data.game.roomID;
    } else {
      console.error("Error creating game:", data);
      setStatusText("Error creating game");
      return null;
    }
  }

  // Permet à l'admin de rejoindre la partie qu'il a créée
  async function joinGame(playerSocketID, isAdmin, roomID) {
    setStatusText("Joining the game ...");
    // Call /games/join
    let response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/games/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roomID: roomID,
        playerSocketID: playerSocketID,
        isAdmin: isAdmin,
      }),
    });

    let data = await response.json();

    if (data.result) {
      // Mise à jour du reducer player avec les infos du joueur/admin
      setStatusText("Joined the game");
      dispatch(
        newPlayer({
          playerID: data.player.playerID,
          isAdmin: data.player.isAdmin,
          playerName: data.player.playerName,
        })
      );
      return true;
    } else {
      console.error(`Error joining game ${roomID}:`, data);
      setStatusText(`Error joining game ${roomID}`);
      return false;
    }
  }

  // Fonction principale pour créer et rejoindre une nouvelle partie en admin
  async function adminCreateGame(nbRound) {
    // Create a game
    setStatusText("Creating game ...");
    let roomID = await createGame(nbRound);
    // console.log("Room ID:", roomID);
    if (!roomID) {
      setStatusText("Error creating game");
      return;
    }
    // Join the game
    setStatusText("Joining game ...");
    let gameJoined = await joinGame(socket.id, true, roomID);
    if (gameJoined) {
      setStatusText(`Game ${roomID} has been joined`);
      // console.log(`Game ${roomID} has been joined`);
      // Navigate to PlayerName when game is ready
      navigation.replace("PlayerName");
    }

    // setStatusText("Initiating game ...");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NewMultiGame</Text>
      <Text>Status: {statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
