import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
// Load context and State managers
import { SocketContext } from "../contexts/SocketContext";
import { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
// Load components
import { LobbyPlayerAdminMenu } from "./LobbyPlayerAdminMenu";
import { LobbyPlayerDetailModal } from "./LobbyPlayerDetailModal";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const LobbyPlayerCard = ({ navigation, id, name }) => {
  const player = useSelector((state) => state.player.value);
  const [modalDetailVisible, setModalDetailVisible] = useState(false);

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.playerButton}
        onPress={() => setModalDetailVisible(true)}
      >
        <Text style={styles.playerName}>{name}</Text>
      </TouchableOpacity>
      {player.isAdmin && (
        <LobbyPlayerAdminMenu
          style={styles.playerAdminMenu}
          playerID={id}
        ></LobbyPlayerAdminMenu>
      )}

      <LobbyPlayerDetailModal
        navigation={navigation}
        visible={modalDetailVisible}
        id={id}
        name={name}
        hide={() => {
          setModalDetailVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  playerName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
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
  playerAdminMenu: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
