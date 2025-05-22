import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";


const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function PlayerLobby({ route, navigation }) {
  const gameID = "682c986c3faa881ff6c9abe8"; // gameID passé depuis la navigation --> route.params
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/players/${gameID}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setPlayers(data.players);
        } else {
          console.error("Erreur:", data.error);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur fetch:", error);
        setLoading(false);
      });
  }, [gameID]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Joueurs dans la Gaîème</Text>
      {players.map((player) => (
        <TouchableOpacity
          key={player._id}
          style={styles.playerCard}
          onPress={() => console.log(`Clicked on ${player.playerName}`)}
        >
          <Text style={styles.playerName}>{player.playerName}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "#f0f8ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  playerCard: {
    backgroundColor: "#3498db",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  playerName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
