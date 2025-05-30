import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { useState, useEffect, useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/logo-faceparty.png";

// Loadreducers
import { useDispatch } from "react-redux";
import { newGame } from "../reducers/game";
import { newPlayer } from "../reducers/player";
// Load components
import { JoinQRScanner } from "../components/JoinQRScanner";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function JoinMultiGame({ navigation }) {
  const socket = useContext(SocketContext);
  const [roomID, setRoomID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [scannerVisible, setScannerVisible] = useState(false);
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

  const handleCodeSubmission = async (roomIDvalue) => {
    console.log(`testing code ${roomIDvalue.toUpperCase()}`);

    setErrorMessage("");
    if (roomIDvalue.length !== 4) {
      setErrorMessage("Please enter a valid code");
      return;
    }
    if (!socket) {
      setErrorMessage("Socket connection not established");
      return;
    }
    try {
      let joined = await joinGame(socket.id, false, roomIDvalue.toUpperCase());
      if (joined) {
        // Navigate to the game screen => PlayerName
        navigation.replace("PlayerName");
      } else {
        setErrorMessage("Failed to join the game. Please try again.");
      }
    } catch (error) {
      console.error("Error joining game:", error);
      setErrorMessage("Failed to join the game. Please try again.");
    }
  };

  const handleScanSuccess = (code) => {
    setRoomID(code);
    handleCodeSubmission(code);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <View style={styles.statusBarSpacer} /> */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>FaceParty</Text>
      </View>
      <View style={styles.container}>
        {/* Scan to fill the code */}
        <TouchableOpacity onPress={() => setScannerVisible(true)}>
          <Ionicons name="qr-code-outline" size={120} color="#333" />
        </TouchableOpacity>

        <Modal visible={scannerVisible} animationType="slide">
          <JoinQRScanner
            onScanned={handleScanSuccess}
            onCancel={() => setScannerVisible(false)}
          />
        </Modal>

        {/* Joining by entering the code */}
        <Text style={styles.titleQR}>Join a game</Text>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TextInput
          style={styles.input}
          placeholder="XXXX"
          value={roomID}
          onChangeText={(value) => setRoomID(value)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleCodeSubmission(roomID)}
        >
          <Text style={styles.buttonText}> JOIN </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    backgroundColor: "#0F3D62",
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
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F1F1",
  },
  statusBarSpacer: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 16,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#0F3D62",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "600",
    color: "#F1F1F1",
  },
  titleQR: {
    color: "black",
  },
});
