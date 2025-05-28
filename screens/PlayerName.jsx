import { StyleSheet, Text, View, TextInput, TouchableOpacity, Animated } from "react-native";
import { useState, useRef, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function PlayerName({ navigation }) {
  //----------------------------------------------
  //VARIABLES ------------------------------------
  //----------------------------------------------
  const socket = useContext(SocketContext);

  const [playerName, setPlayerName] = useState("");

  // Récupération du playerID depuis le reducer player
  const { playerID } = useSelector((state) => state.player.value);
  const { roomID, gameID } = useSelector((state) => state.game.value);

  //Animation pour la bordure du TextInput
  const borderAnim = useRef(new Animated.Value(0)).current;
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F86F5D", "#0F3D62"] // orange <-> blanc (ou toute autre couleur)
  });
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);


  //----------------------------------------------
  //FONCTIONS ------------------------------------
  //----------------------------------------------
  const handleSubmit = () => {
    if (playerName.length === 0 || !playerID) {
      alert("Tu as oublié de renseigner ton prénom !");
      return;
    }

    fetch(`${EXPO_PUBLIC_BACKEND_URL}/players/updateName`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerID: playerID,
        playerName: playerName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        if (data.result) {
          socket.emit("playerUpdate", roomID);
          navigation.navigate("SnapScreen");
        } else {
          alert("Erreur lors de la mise à jour du nom.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur réseau.");
      });
  };

  //----------------------------------------------
  //USEEFFECT ------------------------------------
  //----------------------------------------------
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [borderAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Écris ton prénom</Text>
      <Animated.View style={[styles.inputWrapper, { borderColor }]}>
        <TextInput placeholder="Mon prénom" onChangeText={setPlayerName} value={playerName} style={styles.input} />
      </Animated.View>
      <View style={styles.notice}>
        <Text style={styles.titleNotice}>Pour un quizz optimal :</Text>
        <Text style={styles.infoNotice}>🙅 Pas de surnom</Text>
        <Text style={styles.infoNotice}>🫡 Ne mets QUE ton prénom</Text>
        <Text style={styles.infoNotice}>🥲 N'oublie pas le prénom des autres</Text>
      </View>
        <AnimatedTouchable onPress={handleSubmit} style={[styles.button, {borderColor, borderWidth:2}]} activeOpacity={0.8}>
          <Text style={styles.textButton}>Ok pour moi !</Text>
        </AnimatedTouchable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: 200,
    borderWidth: 2,
    borderColor: "#F86F5D",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  button: {
    backgroundColor: "rgba(27, 77, 115, 1)",
    padding: 20,
    borderRadius: 5,
    width: "40%",
  },
  textButton: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  inputWrapper: {
    borderWidth: 2,
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    width: 200,
    padding: 10,
    textAlign: "center",
  },
  // ---------------------------------------------------
  // Styles for the Notice informations ----------------
  // ---------------------------------------------------
  notice: {
    width: "80%",
    height: 120,
    backgroundColor: 'rgba(27, 77, 115, 1)',
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  titleNotice: {
    color: 'white',
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoNotice: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
  },
});
