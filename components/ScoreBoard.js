import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

import { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const ScoreBoard = () => {
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
    });
  };

  return (
    <SafeAreaView style={styles.lobby}>
      <Text style={styles.title}>🏆 Classement des joueurs</Text>

      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.header]}>Rang</Text>
        <Text style={[styles.cell, styles.header]}>Nom</Text>
        <Text style={[styles.cell, styles.header]}>Score</Text>
      </View>

      {/* Scroll uniquement sur la liste des joueurs */}
      <View style={styles.playerListContainer}>
        <ScrollView contentContainerStyle={styles.playerList}>
          {players.map((player, index) => (
            <View key={player._id} style={styles.row}>
              <Text style={styles.cell}>{index + 1}</Text>
              <Text style={styles.cell}>{player.playerName}</Text>
              <Text style={styles.cell}>{player.score}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {admin && (
        <TouchableOpacity style={styles.startButton} onPress={continueParty}>
          <Text style={styles.startButtonText}>Next round</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#FBB954",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  playerListContainer: {
    flex: 1,
    maxHeight: "65%", // Tu peux adapter la hauteur selon le layout souhaité
  },
  playerList: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    backgroundColor: "#0F3D62",
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
    backgroundColor: "#F86F5D",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  startButtonText: {
    fontSize: 18,
    color: "#F1F1F1",
    fontWeight: "bold",
  },
});
