import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
// Load context and State managers
import { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
// Load components
import { LobbyKickButton } from "./LobbyKickButton";
import { LobbyPlayerDetailModal } from "./LobbyPlayerDetailModal";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const LobbyPlayerCard = ({
  navigation,
  id,
  name,
  isAdmin = false,
  type,
}) => {
  const currentPlayer = useSelector((state) => state.player.value);
  const [modalDetailVisible, setModalDetailVisible] = useState(false);

  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.buttonWithBadgeContainer,
          type === "player" ? styles.playerButton : styles.characterButton,
        ]}
        onPress={() => setModalDetailVisible(true)}
      >
        {/* Admin badge */}
        {isAdmin && (
          <View style={styles.adminBadge}>
            <Text>Admin</Text>
          </View>
        )}
        <Text style={styles.playerName}>{name}</Text>
      </TouchableOpacity>
      {currentPlayer.isAdmin && (
        <LobbyKickButton
          style={styles.playerAdminMenu}
          idToKick={id}
          type={type}
        ></LobbyKickButton>
      )}

      <LobbyPlayerDetailModal
        navigation={navigation}
        visible={modalDetailVisible}
        id={id}
        name={name}
        type={type}
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

  buttonWithBadgeContainer: {
    position: "relative",
    margin: 5,
    height: 40,
    width: "80%",
    borderRadius: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  playerButton: {
    backgroundColor: "#0F3D62",
  },
  characterButton: {
    backgroundColor: "#0F3D6295",
  },
  adminBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#de6b58",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    zIndex: 10,
  },
  adminBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  playerName: {
    color: "#F1F1F1",
    fontSize: 18,
    fontWeight: "bold",
  },
  playerAdminMenu: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
