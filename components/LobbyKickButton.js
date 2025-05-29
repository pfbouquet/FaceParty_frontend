import { StyleSheet, View, TouchableOpacity, Button, Text } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const LobbyKickButton = ({ idToKick, type }) => {
  const game = useSelector((state) => state.game.value);

  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result?.status === "granted");
    })();
  }, []);

  function kickPlayer() {
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/games/kick-player`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerID: idToKick,
        roomID: game.roomID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          console.error(
            "Erreur: couldn't kick player out of the room.",
            data.error
          );
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.error("Erreur fetch:", error);
      });
  }

  function kickCharacter() {
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/games/kick-character`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterID: idToKick,
        roomID: game.roomID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.result) {
          console.error(
            "Erreur: couldn't kick character out of the room.",
            data.error
          );
        } else {
          console.log(data.message);
        }
      })
      .catch((error) => {
        console.error("Erreur fetch:", error);
      });
  }

  return (
    <View style={styles.container}>
      {/* Button to kick player, only visible to admin */}
      <TouchableOpacity
        style={styles.playerKickButton}
        onPress={() => {
          if (type === "player") {
            kickPlayer();
          } else if (type === "character") {
            kickCharacter();
          }
        }}
      >
        <FontAwesome
          name="remove"
          size={30}
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
