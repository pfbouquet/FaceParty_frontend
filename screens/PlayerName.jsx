import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useSelector } from "react-redux";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function PlayerName({ navigation }) {
  const [playerName, setPlayerName] = useState("");

  // Récupération du playerID depuis le reducer player
  const playerID = useSelector((state) => state.player.value.playerID);

  const handleSubmit = () => {
    if (playerName.length === 0 || !playerID) {
      alert("Player name or ID is missing.");
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
          navigation.navigate("PlayerLobby");
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
    <View style={styles.container}>
      <Text style={styles.title}>PlayerNameInput</Text>
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
  input: {
    width: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
  },
  textButton: {
    color: "#fff",
    fontWeight: "bold",
  },
});
