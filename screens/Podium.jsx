import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import { useEffect, useState, useContext } from "react";
import ConfettiCannon from 'react-native-confetti-cannon';
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function Podium({ navigation }) {
  const socket = useContext(SocketContext);
  const gameID = useSelector((state) => state.game.value.gameID);
  const roomID = useSelector((state) => state.game.value.roomID);
  const admin = useSelector((state) => state.player.value.isAdmin);
  const question = useSelector((state) => state.question.value);
  const [players, setPlayers] = useState([]);

  const fetchPlayers = (id) => {
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/players/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // Trie par score décroissant
          const sorted = [...data.players].sort((a, b) => b.score - a.score);
          setPlayers(sorted);
        } else {
          console.error("Erreur:", data.error);
        }
      })
      .catch((error) => {
        console.error("Erreur fetch:", error);
      });
  };

  useEffect(() => {
    gameID && fetchPlayers(gameID);
  }, []);

  const continueParty = () => {
    console.log("continue party to next question");
    socket.emit("game-cycle", {
      type: "get-next-question",
      roomID: roomID,
      gameID: gameID,
      currentQuestionIndex: question.index,
    }); //transmet le signal de l'admin pour passer à la prochaine question
  };

  return (
    <SafeAreaView style={styles.lobby}>
    <ConfettiCannon count={100} origin={{ x: -10, y: 0 }} fadeOut={true} />
      <Text style={styles.title}>🏆 Podium 🏆</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.header]}>Rang</Text>
        <Text style={[styles.cell, styles.header]}>Nom</Text>
        <Text style={[styles.cell, styles.header]}>Score</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {players.map((player, index) => (
          <View key={player._id} style={[styles.row, index === 0 && { backgroundColor: "#f1c40f" }, index === 1 && { backgroundColor: "#bdc3c7" }, index === 2 && { backgroundColor: "#cd7f32" }]}>
            <Text style={styles.cell}>{index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}</Text>
            <Text style={styles.cell}>{player.playerName}</Text>
            <Text style={styles.cell}>{player.score}</Text>
          </View>
        ))}
      </ScrollView>

      {admin && (
        <TouchableOpacity style={styles.startButton} onPress={continueParty}>
          <Text style={styles.startButtonText}>New Game</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lobby: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#2c3e50",
  },
  container: {
    paddingBottom: 40,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#ecf0f1",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    marginBottom: 10,
    paddingVertical: 15,
    borderRadius: 8,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
  header: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  startButton: {
    backgroundColor: "#de6b58",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  startButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});