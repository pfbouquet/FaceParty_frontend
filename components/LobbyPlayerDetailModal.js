import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Load context and State managers
import { SocketContext } from "../contexts/SocketContext";
import { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePlayerName } from "../reducers/player";

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
  const dispatch = useDispatch();

  function refreshPortrait() {
    setPortraitURL(
      `${EXPO_PUBLIC_BACKEND_URL}/portrait/${type}/${id}?t=${Date.now()}`
    );
  }

  useEffect(() => {
    refreshPortrait();
  }, []);

  function handleModalClose() {
    handleNewName();
    hide();
  }

  function handleNewName() {
    if (newPlayerName.length === 0 || newPlayerName === name) {
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
          dispatch(updatePlayerName(newPlayerName));
          socket.emit("player-update", game.roomID);
        } else {
          alert("Erreur lors de la mise à jour du nom.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur réseau.");
      });
  }

  return (
    <>
      <Modal visible={visible} animationType="fade" transparent>
        <TouchableWithoutFeedback onPress={() => handleModalClose()}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContainer}>
                {player.playerID === id ? ( //condition pour modifier les éléments de la modale si j'en suis le propriétaire
                  <>
                    <View style={styles.nameEdit}>
                      <TextInput
                        onChangeText={(value) => setNewPlayerName(value)}
                        value={newPlayerName}
                        style={styles.modalTitle}
                      />
                      <MaterialCommunityIcons
                        name="account-edit"
                        size={30}
                        color="#F86F5D"
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.replace("SnapScreen")}
                      style={styles.blockChangeImg}
                    >
                      <Image
                        style={styles.image}
                        source={{
                          uri: portraitURL,
                        }}
                      />
                      <MaterialCommunityIcons
                        name="image-edit-outline"
                        size={40}
                        color="#F86F5D"
                        style={styles.photoEditIcon}
                      />
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.modalTitle}>{name}</Text>
                    <Image
                      style={styles.image}
                      source={{
                        uri: portraitURL,
                      }}
                    />
                  </>
                )}
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => handleModalClose()}
                >
                  <Text style={{ color: "white" }}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#F1F1F1",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  nameEdit: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    borderBottomColor: "#de6b58",
    borderBottomWidth: 1,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#F86F5D",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  image: {
    marginTop: 20,
    width: 200,
    height: 300,
    borderRadius: 20,
    alignSelf: "center",
  },
  blockChangeImg: {
    flexDirection: "row",
    justifyContent: "center",
  },
  photoEditIcon: {
    position: "absolute",
    top: 25,
    right: 5,
  },
});
