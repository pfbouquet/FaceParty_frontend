// Composant React Native affichant le podium final des joueurs avec gestion du son, animation confettis, et navigation lobby.

import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Platform, StatusBar } from "react-native";
import { useEffect, useState, useContext, useRef } from "react";
import ConfettiCannon from "react-native-confetti-cannon";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from 'expo-av';
import logo from "../assets/logo-faceparty.png";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function Podium({ navigation }) {
  // ------------------------------------------------------------
  // VARIABLES---------------------------------------------------
  // ------------------------------------------------------------
  const socket = useContext(SocketContext);
  const gameID = useSelector((state) => state.game.value.gameID);
  const roomID = useSelector((state) => state.game.value.roomID);
  const admin = useSelector((state) => state.player.value.isAdmin);
  const playerID = useSelector((state) => state.player.value.playerID);
  const [players, setPlayers] = useState([]);
  const soundCrowd = useRef(null); // soundeffect crowd

  // ------------------------------------------------------------
  // USEEFFECT---------------------------------------------------
  // ------------------------------------------------------------
  //Chargement des joueurs
  useEffect(() => {
    if (gameID) fetchPlayers(gameID);
  }, [gameID]);

  // Écoute du signal socket pour retour au lobby
  useEffect(() => {
    const handler = (data) => {
      if (data.type === "to-the-lobby") {
        navigation.replace("PlayerLobby");
      }
    };

    socket.on("game-cycle", handler);
    return () => {
      socket.off("game-cycle", handler);
    };
  }, []);

  // Chargement et lecture du son d’ambiance lors de l’affichage du podium
  useEffect(() => {
    let isMounted = true;
    const loadAndPlay = async () => {
      const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/crowd.mp3'));
      if (isMounted) {
        soundCrowd.current = sound;
        await soundCrowd.current.replayAsync();
      }
    };
    loadAndPlay();

    return () => {
      isMounted = false;
      if (soundCrowd.current) {
        soundCrowd.current.unloadAsync(); // Libération des ressources audio à la sortie du composant
      }
    };
  }, []);

  // ------------------------------------------------------------
  // FONCTIONS---------------------------------------------------
  // ------------------------------------------------------------
  // Récupère les joueurs et leurs scores, trie par score décroissant
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

  // Émet un signal pour tous retourner au lobby
  const toTheLobby = () => {
    console.log("Bring everyone to the Lobby");
    socket.emit("game-cycle", {
      type: "to-the-lobby",
      roomID: roomID,
      gameID: gameID,
      playerID: playerID,
    });
  };

  // Réinitialise les scores et retour au lobby
  const relaunchParty = async () => {
    try {
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_URL}/players/clearScores/${gameID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.result) {
        console.log("Relauch successful. Returning to lobby...");
        toTheLobby();
      } else {
        console.error("Failed to clear scores:", data.message);
      }
    } catch (error) {
      console.error("Error during relaunchParty:", error.message);
    }
  };

  return (
    <SafeAreaView style={styles.lobby}>
      {/* <View style={styles.statusBarSpacer} /> */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.titleHeader}>FaceParty</Text>
      </View>
      <ConfettiCannon count={300} origin={{ x: -10, y: 0 }} fadeOut={true} fallSpeed={5000} explosionSpeed={900} />

      <Text style={styles.title}>🏆 Podium 🏆</Text>
      <View style={styles.podium}>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, styles.headerPodium]}>Rang</Text>
          <Text style={[styles.cell, styles.headerPodium]}>Nom</Text>
          <Text style={[styles.cell, styles.headerPodium]}>Score</Text>
        </View>
        {/* </View> */}

        <ScrollView contentContainerStyle={styles.container}>
          {players
            .sort((a, b) => b.score - a.score) // Tri par score décroissant
            .map((player, index, sortedPlayers) => {
              // Calcul du rang (en tenant compte des égalités)
              const prev = sortedPlayers[index - 1];
              const rank = index > 0 && player.score === prev.score ? prev.rank : index + 1;
              player.rank = rank; // Stock temporairement pour réutilisation

              // Définir couleur et médaille selon le rang
              let backgroundColor = null;
              let medal = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : rank;

              if (rank === 1) backgroundColor = "#f1c40f";
              else if (rank === 2) backgroundColor = "#bdc3c7";
              else if (rank === 3) backgroundColor = "#cd7f32";

              return (
                <View key={player._id} style={[styles.row, backgroundColor && { backgroundColor }]}>
                  <Text style={styles.cell}>{medal}</Text>
                  <Text style={styles.cell}>{player.playerName}</Text>
                  <Text style={styles.cell}>{player.score}</Text>
                </View>
              );
            })}
        </ScrollView>

        {/* Bouton visible uniquement par l’admin pour relancer une nouvelle partie */}
        {admin && (
          <TouchableOpacity style={styles.startButton} onPress={relaunchParty}>
            <Text style={styles.startButtonText}>New Game</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  lobby: {
    flex: 1,
    backgroundColor: "white",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    // justifyContent: "center",
    margin: "2%",
    color: "#0F3D62",
  },
  podium: {
    paddingTop: "1%",
    paddingHorizontal: "5%",
    flex: 1,
    maxHeight: "85%",
  },
  container: {
    // paddingBottom: "45%",
    // maxHeight: "65%",
  },
  tableHeader: {
    flexDirection: "row",
    // backgroundColor: "#ecf0f1",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
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
  headerPodium: {
    fontWeight: "bold",
    color: "#0F3D62",
  },
  startButton: {
    backgroundColor: "#F86F5D",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    // marginTop: 20,
    // alignSelf: 'baseline',
    justifySelf: '',
    // just: 'flex-end'

  },
  startButtonText: {
    fontSize: 18,
    color: "#F1F1F1",
    fontWeight: "bold",
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
  titleHeader: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "600",
    color: "#F1F1F1",
  },
  newGameButton: {
    // marginTop: "50%",
  },
});
