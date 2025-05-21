import { StyleSheet, Text, View, Button } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function HomeAdmin({ navigation }) {
  const socket = useContext(SocketContext);
  const [roomID, setRoomID] = useState(null);

  async function createGame(nbRound = 10, socketID) {
    // Create a game
    let response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/games/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nbRound: nbRound,
        adminSocketID: socketID,
      }),
    });
    let data = await response.json();
    console.log(data);
    setRoomID(data.game.roomID);
  }

  async function goToHome() {
    // Deconnect le socket de la room
    socket.emit("leave-room", roomID);
    // Reset roomID
    setRoomID(null);
    // Navigate to home
    navigation.navigate("Home");
  }

  useEffect(() => {
    if (!socket) return;

    // Handle event room joined
    socket.on("player-joined", ({ socketId, room }) => {
      console.log(`A new player joined party ${room}: ${socketId}`);
    });
    socket.on("room-state", ({ room, currentPlayers }) => {
      console.log(`Party ${room} now has players:`, currentPlayers);
    });
    socket.on("joined-success", ({ message, room }) => {
      console.log(message, room);
    });
    socket.on("left-success", ({ message, room }) => {
      console.log(message, room);
    });
    socket.on("user-left", ({ leaver }) => {
      console.log(`${leaver} has left the party`);
    });

    createGame(10, socket.id);

    return () => {
      socket.off("player-joined");
      socket.off("room-state");
      socket.off("joined-success");
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player socket:</Text>
      <Button title="Go to Home" onPress={() => goToHome()} />
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
