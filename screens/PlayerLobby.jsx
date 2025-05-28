import { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Image, Modal, Platform, StatusBar } from "react-native";
import * as ClipboardExpo from "expo-clipboard";
import { Share } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Ionicons } from "@expo/vector-icons";
import { SocketContext } from "../contexts/SocketContext";
import FontAwesome from "react-native-vector-icons/FontAwesome";
// Load reducers
import { useSelector, useDispatch } from "react-redux";

// Load components
import { LobbyPlayerAdminMenu } from "../components/LobbyPlayerAdminMenu";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/logo-faceparty.png";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function PlayerLobby({ route, navigation }) {
  /*  supprimer le route dans la fonction ??? */
  const socket = useContext(SocketContext);
  const gameID = useSelector((state) => state.game.value.gameID);
  const roomID = useSelector((state) => state.game.value.roomID);
  const admin = useSelector((state) => state.player.value.isAdmin);
  const player = useSelector((state) => state.player.value);

  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalQRVisible, setModalQRVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [selfieURL, setSelfieURL] = useState("");
  const [playnerNameClick, setPlayerNameClick] = useState("");
  const [selectedPlayerID, setSelectedPlayerID] = useState("");

  // FONCTIONS --------------------------------------------------------------
  const fetchPlayers = (id) => {
    if (!EXPO_PUBLIC_BACKEND_URL) {
      console.error("EXPO_PUBLIC_BACKEND_URL is not defined.");
      setLoading(false);
      return;
    }
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

  function handleNewName() {
    if (newPlayerName.length === 0 || newPlayerName === player.playerName) {
      alert("Player name empty or unchanged.");
      return;
    }

    fetch(`${EXPO_PUBLIC_BACKEND_URL}/players/updateName`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerID: player.playerID,
        playerName: newPlayerName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        if (data.result) {
          socket.emit("player-update", roomID);
        } else {
          alert("Erreur lors de la mise à jour du nom.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur réseau.");
      });
    setModalVisible(false);
  }

  function handleModal(id, playerName) {
    setSelfieURL(`${EXPO_PUBLIC_BACKEND_URL}/selfie/${id}`);
    setNewPlayerName(playerName);
    setPlayerNameClick(playerName);
    setSelectedPlayerID(id);
    setModalVisible(true);
  }

  // USEEFFECT --------------------------------------------------------------
  useEffect(() => {
    socket.on("game-id", (id) => {
      fetchPlayers(id);
    });

    socket.on("you-are-kicked", (id) => {
      // Navigate to home screen
      navigation.navigate("HomeMulti");
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
    return () => socket.off("game-preparation", () => navigation.navigate("GamePreparation"));
  }, []);

  useEffect(() => {
    gameID && fetchPlayers(gameID);

    socket.on("player-update", () => fetchPlayers(gameID));
    return () => socket.off("player-update", () => fetchPlayers(gameID));
  }, [gameID, socket]);

  if (loading || !gameID) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  // VARIABLES --------------------------------------------------------------
  const modal = (
    <Modal visible={modalVisible} animationType="fade" transparent>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalCross}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={styles.crossModal}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>X</Text>
            </TouchableOpacity>
          </View>

          {player.playerID === selectedPlayerID ? ( //condition pour modifier les éléments de la modale si j'en suis le propriétaire
            <>
              <TouchableOpacity onPress={() => navigation.navigate("SnapScreen")} activeOpacity={0.8} style={styles.blockChangeImg}>
                <Image style={styles.image} source={{ uri: selfieURL }} />
                <FontAwesome name="pencil" size="20" color="#de6b58" style={styles.icon} />
              </TouchableOpacity>
              <TextInput onChangeText={setNewPlayerName} value={newPlayerName} style={styles.input} />
              <TouchableOpacity onPress={handleNewName} style={styles.button} activeOpacity={0.8}>
                <Text style={styles.textButton}>Update</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Image style={styles.image} source={{ uri: selfieURL }} />
              <Text>{playnerNameClick}</Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  //fonction au clic sur le bouton START
  function startParty() {
    socket.emit("start-game", roomID); //transmet le signal de l'admin pour lancer la partie
  }

  return (
    <SafeAreaView style={styles.lobby}>
      <View style={styles.statusBarSpacer} />
            <View style={styles.header}>
              <Image source={logo} style={styles.logo} resizeMode="contain" />
              <Text style={styles.titleHeader}>FaceParty</Text>
            </View>
      <ScrollView contentContainerStyle={styles.container}>
        {modal}
        <Text style={styles.title}>PlayerLobby</Text>
        <View style={styles.roomCodeContainer}>
          <Text style={styles.roomCodeInvite}>Room :</Text>
          <Text style={styles.roomCode}>{roomID}</Text>
          <TouchableOpacity onPress={() => ClipboardExpo.setStringAsync(roomID)}>
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
          <TouchableOpacity onPress={() => setModalQRVisible(true)}>
            <Ionicons name="qr-code-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        {players.map((player) => (
          <View key={player._id} style={styles.playerCard}>
            <TouchableOpacity
              style={styles.playerButton}
              // onPress={() => console.log(`Clicked on ${player.playerName}`)}
              onPress={() => handleModal(player._id, player.playerName)}
            >
              <Text style={styles.playerName}>{player.playerName}</Text>
            </TouchableOpacity>
            {admin && <LobbyPlayerAdminMenu style={styles.playerAdminMenu} playerID={player._id} roomID={roomID}></LobbyPlayerAdminMenu>}
          </View>
        ))}
      </ScrollView>

      {admin && (
        <TouchableOpacity style={styles.startButton} onPress={() => startParty()}>
          <Text style={styles.playerName}>START</Text>
        </TouchableOpacity>
      )}
      <Modal animationType="slide" transparent={true} visible={modalQRVisible} onRequestClose={() => setModalQRVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.title}>Scan ce QR pour rejoindre</Text>
            <QRCode value={roomID} size={200} backgroundColor="white" />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalQRVisible(false)}>
              <Text style={{ color: "white" }}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  playerButton: {
    backgroundColor: "#3498db",
    height: "80%",
    width: "80%",
    borderRadius: 10,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  playerName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  playerAdminMenu: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
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
  // QR Code model styles
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#de6b58",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalCross: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "",
    width: "100%",
  },
  input: {
    width: 200,
    borderBottomColor: "#de6b58",
    borderBottomWidth: 1,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    width: 200,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "#de6b58",
    borderRadius: 10,
  },
  textButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
  image: {
    width: 150,
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: "center",
    marginRight: -20,
  },
  crossModal: {
    width: 30,
    height: 30,
    borderRadius: 15,
    paddingTop: 5,
    backgroundColor: "#de6b58",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -10,
    marginBottom: 15,
  },
  blockChangeImg: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  icon: {
    marginLeft: -5,
    marginTop: 10,
  },
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
  titleHeader:{
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "600",
    color: "#F1F1F1",
  },
});
