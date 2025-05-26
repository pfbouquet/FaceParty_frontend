import { StyleSheet, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useState, useEffect } from "react";
import { SocketContext } from "../contexts/SocketContext";

export const GameLifeGetReadyForNextQuestion = () => {
  const player = useSelector((state) => state.player.value);
  const socket = useContext(SocketContext);
  const roomID = useSelector((state) => state.game.value.roomID);
  const [counter, setCounter] = useState(3);

  useEffect(() => {
    if (counter === 0) {
      if (player.isAdmin) {
        socket.emit("game-cycle", { type: "go-question", roomID: roomID });
      }
      return;
    }

    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Prépare toi à la question i/nbround</Text>
      <Text styles={styles.countdown}>{counter}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  counter: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#0F3E61",
    backgroundColor: "#FA725A",
    padding: 20,
    borderRadius: 10,
  },
});
