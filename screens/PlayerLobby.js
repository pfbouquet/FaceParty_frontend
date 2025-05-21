import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SocketContext } from "../contexts/SocketContext";

export default function PlayerLobby({ navigation }) {
  const [gameID, setGameID] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const socket = useContext(SocketContext);

  const fetchPlayers = (id) => {
    setLoading(true);
    fetch(`http://192.168.100.236:3000/players/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          setPlayers(data.players);
        } else {
          console.error('Erreur:', data.error);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur fetch:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Écoute un événement pour récupérer dynamiquement le gameID
    socket.on("game-id", (id) => {
      console.log("Received gameID:", id);
      setGameID(id);
      fetchPlayers(id); // Fetch les joueurs une fois le gameID reçu
      console.log(gameID);
    });


    // Écoute les événements socket pour mettre à jour les joueurs
    socket.on("room-state", ({ room, currentPlayers }) => {
      if (room === gameID) {
        console.log(`Party ${room} now has players:`, currentPlayers);
        fetchPlayers(room); // Relance le fetch pour mettre à jour les joueurs
      }
    });

    // Nettoyage des écouteurs socket
    return () => {
      socket.off("game-id");
      socket.off("room-state");
    };
  }, [gameID, socket]);

  if (loading || !gameID) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Joueurs dans la Partie</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingVertical: 40,
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  playerCard: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  playerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
