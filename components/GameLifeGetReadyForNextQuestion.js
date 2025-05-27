import { StyleSheet, View, Text, Animated, Easing, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useState, useEffect, useRef } from "react";
import { SocketContext } from "../contexts/SocketContext";

export const GameLifeGetReadyForNextQuestion = () => {
  const player = useSelector((state) => state.player.value);
  const socket = useContext(SocketContext);
  const roomID = useSelector((state) => state.game.value.roomID);
  const game = useSelector((state) => state.game.value);
  const question = useSelector((state) => state.question.value); //utile pour récupérer l'index de la question
  const [counter, setCounter] = useState(3);
  const [nbRound, setNbRound] = useState(0);


  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });


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
      <TouchableOpacity>
        <Animated.Image
          source={require('../assets/logo-faceparty.png')}
          style={[styles.logo, { transform: [{ rotate: spin }] }]}
        />
      </TouchableOpacity>
      <Text style={styles.text}>Prépare toi à la question {question.index + 1}/{game.nbRound}</Text>
      <Text style={styles.counter}>{counter}</Text>
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
    fontSize: 36,
    fontWeight: "bold",
    backgroundColor: "#FA725A",
    color: "#0F3E61",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
