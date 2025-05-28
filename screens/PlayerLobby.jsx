import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Platform,
  StatusBar,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/logo-faceparty.png";
// Load context and State managers
import { SocketContext } from "../contexts/SocketContext";
import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
// Load components
import { RoomCodeSharing } from "../components/RoomCodeSharing";
import { LobbyPlayerCard } from "../components/LobbyPlayerCard";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function PlayerLobby({ navigation }) {
  /*  supprimer le route dans la fonction ??? */
  const socket = useContext(SocketContext);
  const game = useSelector((state) => state.game.value);
  const player = useSelector((state) => state.player.value);

  const [players, setPlayers] = useState([]);

  // FONCTIONS --------------------------------------------------------------
  const updateGameCompo = (id) => {
    if (!game.gameID) {
      console.log("Waiting for game.gameID to be set...");
      return;
    }
    if (!EXPO_PUBLIC_BACKEND_URL) {
      console.error("EXPO_PUBLIC_BACKEND_URL is not defined.");
      return;
    }
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/players/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setPlayers(data.players);
        } else {
          console.error("Erreur:", data.error);
        }
      })
      .catch((error) => {
        console.error("Erreur fetch:", error);
      });
  };

  // USEEFFECT --------------------------------------------------------------
  // Component mount and gameID change effect
  useEffect(() => {
    // Load game composition for the first time
    if (!game.gameID) {
      console.log("Waiting for game.gameID to be set...");
      return;
    } else {
      updateGameCompo(game.gameID);
    }
  }, [game.gameID]);

  useEffect(() => {
    // Update game composition when player-update event is received
    socket.on("player-update", () => updateGameCompo(game.gameID));
    // Navigate to home screen when kicked from the room
    socket.on("you-are-kicked", () => {
      navigation.navigate("HomeMulti");
    });
    // Navigate to GameLifeScreen when the game is being prepared
    socket.on("game-preparation", () => navigation.navigate("GameLifeScreen"));

    return () => {
      socket.off("you-are-kicked", (id) => {
        navigation.navigate("HomeMulti");
      });
      socket.off("player-update", () => updateGameCompo(game.gameID));
      socket.off("game-preparation", () =>
        navigation.navigate("GamePreparation")
      );
    };
  }, []);

  // ACTIONS HANDLERS --------------------------------------------------------------

  //fonction au clic sur le bouton START
  function startParty() {
    socket.emit("start-game", game.roomID); //transmet le signal de l'admin pour lancer la partie
  }

  // RETURN JSX --------------------------------------------------------------
  // If no gameID, show a loader, waiting for gameID to be set
  if (!game.gameID) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }
  // Else, render the PlayerLobby
  return (
    <SafeAreaView style={styles.lobby}>
      {/* HEADER */}
      <View style={styles.statusBarSpacer} />
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.titleHeader}>FaceParty</Text>
      </View>

      {/* MAIN */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>PlayerLobby</Text>
        <RoomCodeSharing />
        {/* PLAYERS CARDS */}
        {players.map((p) => (
          <LobbyPlayerCard
            key={p._id}
            style={styles.playerCard}
            navigation={navigation}
            id={p._id}
            name={p.playerName || "loading..."}
          ></LobbyPlayerCard>
        ))}

        {/* CHARACTERS CARDS */}
      </ScrollView>

      {player.isAdmin && (
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => startParty()}
        >
          <Text style={styles.textButton}>START</Text>
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
    marginVertical: 10,
    width: "100%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
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
  statusBarSpacer: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    //  paddingHorizontal: 26,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#0F3D62",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  titleHeader: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "600",
    color: "#F1F1F1",
  },
});
