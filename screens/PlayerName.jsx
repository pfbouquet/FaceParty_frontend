import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function PlayerName({ navigation }) {
  const socket = useContext(SocketContext);

  const [playerName, setPlayerName] = useState("");

  // Récupération du playerID depuis le reducer player
  const { playerID } = useSelector((state) => state.player.value);
  const { roomID, gameID } = useSelector((state) => state.game.value);
  console.log({ playerID, roomID, gameID });

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
    <View style={styles.container}>
      <Text style={styles.title}>Écris ton prénom</Text>
      <TextInput placeholder="Mon prénom" onChangeText={(value) => setPlayerName(value)} value={playerName} style={styles.input} />
      <View style={styles.notice}>
        <Text style={styles.titleNotice}>Pour un quizz optimal :</Text>
        <Text style={styles.infoNotice}>🙅 Pas de surnom</Text>
        <Text style={styles.infoNotice}>🫡 Ne mets QUE ton prénom</Text>
        <Text style={styles.infoNotice}>🥲 N'oublie pas le prénom des autres</Text>
      </View>
      <TouchableOpacity onPress={handleSubmit} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.textButton}>Ok pour moi !</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 200,
    borderWidth: 2,
    borderColor: "#F86F5D",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  button: {
    backgroundColor: "rgba(27, 77, 115, 1)",
    padding: 20,
    borderRadius: 5,
    width:"40%",
  },
  textButton: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  // ---------------------------------------------------
  // Styles for the Notice informations ----------------
  // ---------------------------------------------------
  notice: {
    width: "80%",
    height: 120,
    backgroundColor: 'rgba(27, 77, 115, 1)',
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  titleNotice: {
    color: 'white',
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoNotice: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
  },
});
