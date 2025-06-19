//Screen INUTILISÉ actuellement > utile en mode dev pour la personnaliser et aller directement à certaines étapes du jeu par exemple

import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { use, useContext, useEffect } from "react";
// import { SocketContext } from "../contexts/SocketContext";
// load reducers
import { useDispatch } from "react-redux";
import { resetGame } from "../reducers/game";
import { resetPlayer } from "../reducers/player";
import { resetQuestion } from "../reducers/question";

export default function Home({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // reset reducers when entering the Home screen
    dispatch(resetGame());
    dispatch(resetPlayer());
    dispatch(resetQuestion());
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HOME</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("HomeMulti")}
      >
        <Text style={styles.buttonText}>Multiplayer</Text>
      </TouchableOpacity>
      <Button
        title="Go to GameLifeScreen"
        onPress={() => navigation.navigate("GameLifeScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Add your styles here
  // Example:
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5c3f81",
    width: "50%",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
