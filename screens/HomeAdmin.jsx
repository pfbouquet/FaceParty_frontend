import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
import Constants from "expo-constants";
// import game and player reducers
import { useDispatch } from "react-redux";
import { initGame } from "../reducers/game";
import { initPlayer } from "../reducers/player";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function HomeAdmin({ navigation }) {
  const socket = useContext(SocketContext);
  const [statusText, setStatusText] = useState("");
  const dispatch = useDispatch();

  async function createGame(nbRound = 10) {
    setStatusText("Create game in backend ...");
    // Create a game
    let response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/games/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nbRound: nbRound,
      }),
    });
    let data = await response.json();

    if (data.result) {
      setStatusText(`Got a new game code: ${data.game.roomID}`);
      dispatch(
        initGame({
          gameID: data.game.gameID,
          roomID: data.game.roomID,
          nbRound: nbRound,
        })
      );
      console.log("Game created:", data.game.roomID);
      return data.game.roomID;
    } else {
      console.error("Error creating game:", data);
      setStatusText("Error creating game");
      return null;
    }
  }

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
      setStatusText("Joined the game");
      // Set playerID
      dispatch(
        initPlayer({
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

  async function adminCreateGame(nbRound) {
    // Create a game
    setStatusText("Creating game ...");
    let roomID = await createGame(nbRound);
    console.log("Room ID:", roomID);
    if (!roomID) {
      setStatusText("Error creating game");
      return;
    }
    // Join the game
    setStatusText("Joining game ...");
    let gameJoined = await joinGame(socket.id, true, roomID);
    if (gameJoined) {
      setStatusText(`Game ${roomID} has been joined`);
      console.log(`Game ${roomID} has been joined`);
      // Navigate to PlayerLobby
      navigation.navigate("PlayerLobby");
    }
  }

  useEffect(() => {
    if (!socket) return;

    setStatusText("Initiating game ...");
    adminCreateGame(10);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add your styles here
  // Example:
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
