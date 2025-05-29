import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, Platform, StatusBar } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/logo-faceparty.png";
// Load context and State managers
import { SocketContext } from "../contexts/SocketContext";
import { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updatePlayers, updateCharacters } from "../reducers/game";
// Load components
import { RoomCodeSharing } from "../components/RoomCodeSharing";
import { LobbyPlayerCard } from "../components/LobbyPlayerCard";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function PlayerLobby({ navigation }) {
  /*  supprimer le route dans la fonction ??? */
  const socket = useContext(SocketContext);
  const game = useSelector((state) => state.game.value);
  const player = useSelector((state) => state.player.value);
  const dispatch = useDispatch();

  // FONCTIONS --------------------------------------------------------------
  const refreshGameCompo = () => {
    console.log("Refreshing game reducer Players and Characters");
    if (!game.roomID) {
      console.log("Waiting for game.gameID to be set...");
      return;
    }
    if (!EXPO_PUBLIC_BACKEND_URL) {
      console.error("EXPO_PUBLIC_BACKEND_URL is not defined.");
      return;
    }
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/games/${game.roomID}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(updatePlayers(data.game.players));
          dispatch(updateCharacters(data.game.characters));
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
    if (!game.gameID || !game.players) {
      console.log("Waiting for game.gameID to be set...");
      return;
    } else {
      refreshGameCompo();
    }
  }, []);

  useEffect(() => {
    // Update game composition when player-update event is received
    socket.on("player-update", () => refreshGameCompo());
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
      socket.off("player-update", () => refreshGameCompo());
      socket.off("game-preparation", () => navigation.navigate("GamePreparation"));
    };
  }, []);

  // ACTIONS HANDLERS --------------------------------------------------------------

  // Start the game
  function startParty() {
    socket.emit("start-game", game.roomID); //transmet le signal de l'admin pour lancer la partie
  }

  // Add a character
  function addCharacter(type = "celebrity") {
    console.log(`Adding a character of type: ${type}`);
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/games/add-character`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomID: game.roomID,
        // type: type,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          console.error("Erreur:", data.error);
        }
      })
      .catch((error) => {
        console.error("Erreur fetch:", error);
      });

    game.roomID;
  }

  // RETURN JSX --------------------------------------------------------------
  // If no gameID, show a loader, waiting for gameID to be set
  if (!game.gameID || !game.players) {
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
      {/* <View style={styles.statusBarSpacer} /> */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.titleHeader}>FaceParty</Text>
      </View>

      {/* MAIN */}
      <Text style={styles.title}>PlayerLobby</Text>
      <RoomCodeSharing />
      {/* PLAYERS CARDS */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.playersContainer}>
          {game.players.map((p) => (
            <LobbyPlayerCard key={p._id} style={styles.playerCard} navigation={navigation} id={p._id} name={p.playerName || "loading..."} type="player"></LobbyPlayerCard>
          ))}
          {game.characters.map((c) => (
            <LobbyPlayerCard key={c._id} style={styles.playerCard} navigation={navigation} id={c._id} name={c.name || "loading..."} type="character"></LobbyPlayerCard>
          ))}

          {player.isAdmin && (
            <TouchableOpacity style={styles.addCharacterButton} onPress={() => addCharacter("Celebrity")}>
              <Text style={styles.textButton}> + Ajouter une star + </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* CHARACTERS CARDS */}
      </ScrollView>

      {player.isAdmin && (
        <TouchableOpacity style={styles.startButton} onPress={() => startParty()}>
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
    margin: 20,
  },
  playersContainer: {
    width: "100%",
  },
  playerCard: {},
  addCharacterButton: {
    backgroundColor: "#0F3D6290",
    borderColor: "#0F3D62",
    borderWidth: 3,
    // flex :1,
    width: "80%",
    height: 40,
    paddingHorizontal: 0,
    borderRadius: 10,
    marginVertical: 30,
    marginHorizontal: "8%",
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    color: "#F1F1F1",
    fontSize: 18,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#F86F5D",
    paddingVertical: 15,
    // paddingHorizontal: 0,
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
