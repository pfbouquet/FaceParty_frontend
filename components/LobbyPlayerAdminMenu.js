import { StyleSheet, View, TouchableOpacity, Button, Text } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useEffect, useState } from "react";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const LobbyPlayerAdminMenu = ({ playerID, roomID }) => {
  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result?.status === "granted");
    })();
  }, []);

  return (
    <View style={styles.container}>
      {/* Button to kick player, only visible to admin */}
      <TouchableOpacity
        style={styles.playerKickButton}
        onPress={() => {
          // TODO
          fetch(`${EXPO_PUBLIC_BACKEND_URL}/games/kick-player`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              playerID: playerID,
              roomID: roomID,
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (!data.result) {
                console.error(
                  "Erreur: couldn't kick player out of the room.",
                  data.error
                );
              }
            })
            .catch((error) => {
              console.error("Erreur fetch:", error);
            });
        }}
      >
        <FontAwesome
          name="remove"
          size={40}
          color="#de6b58"
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  playerKickButton: {
    alignItems: "center",
    justifyContent: "center",
  },
});
