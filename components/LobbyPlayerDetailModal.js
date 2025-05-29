import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

// Load context and State managers
import { SocketContext } from "../contexts/SocketContext";
import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const LobbyPlayerDetailModal = ({
  navigation,
  visible,
  hide,
  id,
  name,
  type,
}) => {
  const socket = useContext(SocketContext);
  const player = useSelector((state) => state.player.value);
  const game = useSelector((state) => state.game.value);
  const [newPlayerName, setNewPlayerName] = useState(name);
  const [portraitURL, setPortraitURL] = useState("");

  function refreshPortrait() {
    setPortraitURL(
      `${EXPO_PUBLIC_BACKEND_URL}/portrait/${type}/${id}?t=${Date.now()}`
    );
  }

  useEffect(() => {
    refreshPortrait();
  }, []);

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
        playerID: id,
        playerName: newPlayerName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          socket.emit("player-update", game.roomID);
          hide();
        } else {
          alert("Erreur lors de la mise à jour du nom.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur réseau.");
      });
    hide();
  }

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalCross}>
            <TouchableOpacity
              onPress={() => hide()}
              style={styles.crossModal}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>X</Text>
            </TouchableOpacity>
          </View>

          {player.playerID === id ? ( //condition pour modifier les éléments de la modale si j'en suis le propriétaire
            <>
              <TouchableOpacity
                onPress={() => navigation.navigate("SnapScreen")}
                activeOpacity={0.8}
                style={styles.blockChangeImg}
              >
                <Image
                  style={styles.image}
                  source={{
                    uri: portraitURL,
                  }}
                  // le Date.now() évite l'usage du cache par React Native, qui empeche de voir la vraie image courante.
                />
                <FontAwesome
                  name="pencil"
                  size={20}
                  color="#de6b58"
                  style={styles.icon}
                />
              </TouchableOpacity>
              <TextInput
                onChangeText={(value) => setNewPlayerName(value)}
                value={newPlayerName}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => handleNewName()}
                style={styles.button}
                activeOpacity={0.8}
              >
                <Text style={styles.textButton}>Update</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Image
                style={styles.image}
                source={{
                  uri: portraitURL,
                }}
                // le Date.now() évite l'usage du cache par React Native, qui empeche de voir la vraie image courante.
              />
              <Text>{name}</Text>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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
  blockChangeImg: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  icon: {
    marginLeft: -5,
    marginTop: 10,
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
});
