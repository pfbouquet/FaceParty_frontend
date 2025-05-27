import { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import * as ClipboardExpo from "expo-clipboard";
import { Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function PlayerLobby({ route, navigation }) {
  /*  supprimer le route dans la fonction ??? */
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
  };

  useEffect(() => {
    socket.on("game-id", (id) => {
      fetchPlayers(id);
    });

    socket.on("room-state", ({ room, currentPlayers }) => {
      if (room === gameID) {
        fetchPlayers(room);
      }
    });

    return () => {
      socket.off("game-id", (id) => {
        fetchPlayers(id);
      });
      socket.off("room-state", ({ room, currentPlayers }) => {
        if (room === gameID) {
          fetchPlayers(room);
        }
      });
    };
  }, [gameID]);

  useEffect(() => {
    socket.on("game-preparation", () => navigation.navigate("GameLifeScreen"));
    return () =>
      socket.off("game-preparation", () =>
        navigation.navigate("GamePreparation")
      );
  }, []);

  useEffect(() => {
    gameID && fetchPlayers(gameID);

    socket.on("playerUpdate", () => fetchPlayers(gameID));
    return () => socket.off("playerUpdate", () => fetchPlayers(gameID));
  }, [gameID, socket]);

  if (loading || !gameID) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  //fonction au clic sur le bouton START
  function startParty() {
    socket.emit("start-game", roomID); //transmet le signal de l'admin pour lancer la partie
  }

  return (
    <SafeAreaView style={styles.lobby}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>PlayerLobby</Text>
        <View style={styles.roomCodeContainer}>
          <Text style={styles.roomCodeInvite}>Room :</Text>
          <Text style={styles.roomCode}>{roomID}</Text>
          <TouchableOpacity
            onPress={() => ClipboardExpo.setStringAsync(roomID)}
          >
            <Ionicons name="copy-outline" size={25} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={async () => {
              await Share.share({
                message: `${roomID}`,
              });
            }}
          >
            <Ionicons name="share-outline" size={25} color="#333" />
          </TouchableOpacity>
        </View>
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

      {admin && (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => startParty()}
        >
          <Text style={styles.playerName}>START</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "white",
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
  startButton: {
    backgroundColor: "#de6b58",
    paddingVertical: 30,
    paddingHorizontal: 0,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  // Room code styles
  roomCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
    fontSize: 25,
    fontWeight: "bold",
  },
  roomCodeInvite: {
    fontSize: 25,
  },
  roomCode: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
