import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function ScoreBoard({ navigation }) {
  const socket = useContext(SocketContext);
  const gameID = useSelector((state) => state.game.value.gameID);
  const roomID = useSelector((state) => state.game.value.roomID);
  const admin = useSelector((state) => state.player.value.isAdmin);

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlayers = (id) => {
    setLoading(true);
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
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur fetch:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    socket.on("game-id", (id) => {
      fetchPlayers(id);
    });

    return () => {
      socket.off("game-id", (id) => {
        fetchPlayers(id);
      });
    };
  }, [gameID]);

  useEffect(() => {
    gameID && fetchPlayers(gameID);

    socket.on("playerUpdate", () => fetchPlayers(gameID));
    return () => socket.off("playerUpdate", () => fetchPlayers(gameID));
  }, [gameID, socket]);

  const continueParty = () => {
    // socket.emit("start-game", roomID);
    console.log("continueParty");
    socket.emit("game-cycle", { type: "go-startsound", roomID: roomID }); //transmet le signal de l'admin pour revenir sur un compte à rebours
  };

  useEffect(() => {
    const goToStartSound = () => navigation.navigate("Start"); //écoute le signal de lancement plus bas dans startParty() et qui correspond au emit de la fonction StartParty juste au dessus
    socket.on("game-cycle", (data) => {
      setTimeout(() => {
        if (data.type == "go-startsound") {
          goToStartSound();
        }
      }, 500);
    });
    return () => socket.off("game-cycle", goToStartSound);
  }, []);

  // if (loading || !gameID) {
  //   return (
  //     <View style={styles.loader}>
  //       <ActivityIndicator size="large" color="#3498db" />
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={styles.lobby}>
      <Text style={styles.title}>🏆 Classement des joueurs</Text>
      <View style={styles.tableHeader}>
        <Text style={[styles.cell, styles.header]}>Rang</Text>
        <Text style={[styles.cell, styles.header]}>Nom</Text>
        <Text style={[styles.cell, styles.header]}>Score</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {players.map((player, index) => (
          <View key={player._id} style={styles.row}>
            <Text style={styles.cell}>{index + 1}</Text>
            <Text style={styles.cell}>{player.playerName}</Text>
            <Text style={styles.cell}>{player.score}</Text>
          </View>
        ))}
      </ScrollView>

      {admin && (
        <TouchableOpacity style={styles.startButton} onPress={continueParty}>
          <Text style={styles.startButtonText}>Next round</Text>
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
