//Écran permettant à un joueur de saisir son prénom avant de rejoindre la partie.

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Image,
  Platform,
  StatusBar,
} from "react-native";
import { useState, useRef, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/logo-faceparty.png";

// load reducer
import { useDispatch } from "react-redux";
import { updatePlayerName } from "../reducers/player";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function PlayerName({ navigation }) {
  //----------------------------------------------
  //VARIABLES ------------------------------------
  //----------------------------------------------
  const socket = useContext(SocketContext);
  const [playerName, setPlayerName] = useState("");
  const { playerID } = useSelector((state) => state.player.value);
  const { roomID } = useSelector((state) => state.game.value);
  const dispatch = useDispatch();

  //Animation pour la bordure du TextInput
  const borderAnim = useRef(new Animated.Value(0)).current;
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F86F5D", "#0F3D62"], // orange <-> bleu
  });
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  //----------------------------------------------
  //FONCTIONS ------------------------------------
  //----------------------------------------------
  //vérifie que le nom a été renseigné et envoie la modification en BDD + passage à Snapscreen
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
          dispatch(updatePlayerName(playerName));
          socket.emit("player-update", roomID);
          navigation.replace("SnapScreen");
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
  // animation qui fait varier la couleur de la bordure en boucle
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

  //----------------------------------------------
  //JSX ------------------------------------------
  //----------------------------------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <View style={styles.statusBarSpacer} /> */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>FaceParty</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Écris ton prénom</Text>
        <Animated.View style={[styles.inputWrapper, { borderColor }]}>
          <TextInput
            placeholder="Mon prénom"
            onChangeText={(value) => setPlayerName(value)}
            value={playerName}
            style={styles.input}
          />
        </Animated.View>
        <View style={styles.notice}>
          <Text style={styles.titleNotice}>Pour un quizz optimal :</Text>
          <Text style={styles.infoNotice}>🙅 Pas de surnom</Text>
          <Text style={styles.infoNotice}>🫡 Ne mets QUE ton prénom</Text>
          <Text style={styles.infoNotice}>
            🥲 N'oublie pas le prénom des autres
          </Text>
        </View>
        <AnimatedTouchable
          onPress={() => handleSubmit()}
          style={[styles.button, { borderColor, borderWidth: 2 }]}
          activeOpacity={0.8}
        >
          <Text style={styles.textButton}>Ok pour moi !</Text>
        </AnimatedTouchable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F1F1",
  },
  statusBarSpacer: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 16,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#0F3D62",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "600",
    color: "#F1F1F1",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F1F1",
  },
  playerNameTitle: {
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
    backgroundColor: "#0F3D62",
    padding: 20,
    borderRadius: 10,
    width: "40%",
  },
  textButton: {
    color: "#F1F1F1",
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
    backgroundColor: "#0F3D62",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  titleNotice: {
    color: "white",
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
