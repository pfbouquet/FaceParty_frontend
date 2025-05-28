import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/logo-faceparty.png";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function PlayerName({ navigation }) {
  const socket = useContext(SocketContext);
  const [playerName, setPlayerName] = useState("");

  const { playerID } = useSelector((state) => state.player.value);
  const { roomID, gameID } = useSelector((state) => state.game.value);
  console.log({ playerID, roomID, gameID });

  const handleSubmit = () => {
    if (playerName.length === 0 || !playerID) {
      alert("Player name or ID is missing.");
      return;
    }

    if (!EXPO_PUBLIC_BACKEND_URL) {
      alert("Backend URL is not defined.");
      return;
    }

    fetch(`${EXPO_PUBLIC_BACKEND_URL}/players/updateName`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerID: playerID,
        playerName: playerName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        if (data.result) {
          socket.emit("playerUpdate", roomID);
          navigation.navigate("SnapScreen");
        } else {
          alert("Erreur lors de la mise à jour du nom.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur réseau.");
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.statusBarSpacer} />
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>FaceParty</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.playerNameTitle}>Renseigne ton nom ici</Text>
        <TextInput
          placeholder="Player name"
          onChangeText={(value) => setPlayerName(value)}
          value={playerName}
          style={styles.input}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.button}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>I'm OK with my name</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playerNameTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#0F3D62",
    padding: 10,
    borderRadius: 5,
  },
  textButton: {
    color: "#F1F1F1",
    fontWeight: "bold",
  },
});
