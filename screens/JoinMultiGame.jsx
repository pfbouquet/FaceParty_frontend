import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
// import game and player reducers
import { useDispatch } from "react-redux";
import { newGame } from "../reducers/game";
import { newPlayer } from "../reducers/player";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function JoinMultiGame({ navigation }) {
  const socket = useContext(SocketContext);
  const [roomID, setRoomID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();

  async function joinGame(playerSocketID, isAdmin, roomID) {
    // Call /games/join
    try {
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
        // Set player reducer
        dispatch(
          newPlayer({
            playerID: data.player.playerID,
            isAdmin: data.player.isAdmin,
            playerName: data.player.playerName,
          })
        );
        // Set game reducer
        dispatch(
          newGame({
            gameID: data.game.gameID,
            roomID: data.game.roomID,
            nbRound: data.game.nbRound,
          })
        );
        return true;
      } else {
        console.log(`Invalid code ${roomID}:`, data);
        setErrorMessage("Invalid code");
        return false;
      }
    } catch (error) {
      console.error("Error joining game:", error);
      setErrorMessage("Connection issue, try again");
      return false;
    }
  }

  const handleCodeSubmission = async () => {
    console.log(`testing code ${roomID.toUpperCase()}`);

    setErrorMessage("");
    if (roomID.length !== 4) {
      setErrorMessage("Please enter a valid code");
      return;
    }
    if (!socket) {
      setErrorMessage("Socket connection not established");
      return;
    }
    try {
      let joined = await joinGame(socket.id, true, roomID.toUpperCase());
      if (joined) {
        // Navigate to the game screen => PlayerName
        navigation.navigate("PlayerName");
      } else {
        setErrorMessage("Failed to join the game. Please try again.");
      }
    } catch (error) {
      console.error("Error joining game:", error);
      setErrorMessage("Failed to join the game. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JoinMultiGame</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TextInput
        style={styles.input}
        placeholder="XXXX"
        value={roomID}
        onChangeText={(value) => setRoomID(value)}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleCodeSubmission()}
      >
        <Text style={styles.buttonText}> ^ JOIN ^ </Text>
      </TouchableOpacity>
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
  input: {
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    width: "50%",
    paddingHorizontal: 10,
    marginVertical: 10,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#5c3f81",
    width: "50%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorMessage: {
    height: 40,
    color: "red",
  },
});
