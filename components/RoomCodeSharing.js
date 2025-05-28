import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Share,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as ClipboardExpo from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";

import { useState } from "react";
import { useSelector } from "react-redux";

export const RoomCodeSharing = ({}) => {
  const game = useSelector((state) => state.game.value);
  const [modalQRVisible, setModalQRVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.roomCodeInvite}>Room :</Text>
      <Text style={styles.roomCode}>{game.roomID}</Text>
      <TouchableOpacity
        onPress={() => ClipboardExpo.setStringAsync(game.roomID)}
      >
        <Ionicons name="copy-outline" size={25} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={async () => {
          await Share.share({
            message: `${game.roomID}`,
          });
        }}
      >
        <Ionicons name="share-outline" size={25} color="#333" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalQRVisible(true)}>
        <Ionicons name="qr-code-outline" size={24} color="#333" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalQRVisible}
        onRequestClose={() => setModalQRVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Scan ce QR pour rejoindre</Text>
            <QRCode value={game.roomID} size={200} backgroundColor="white" />
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalQRVisible(false)}
            >
              <Text style={{ color: "white" }}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: "#de6b58",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
});
