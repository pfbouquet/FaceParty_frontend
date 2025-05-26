import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { newQuestion } from "../reducers/question";
import { SocketContext } from "../contexts/SocketContext";
import { GameLifeGetReadyForNextQuestion } from "../components/GameLifeGetReadyForNextQuestion";

export default function GameLifeScreen({ navigation }) {
  const socket = useContext(SocketContext);
  const game = useSelector((state) => state.game.value);
  const player = useSelector((state) => state.player.value);
  const [phase, setPhase] = useState("preparation");

  const dispatch = useDispatch();

  let GameContent = <Text>Waiting for game to start...</Text>;

  if (phase === "get-ready") {
    GameContent = <GameLifeGetReadyForNextQuestion />;
  } else if (phase === "question") {
    GameContent = <Text>Next question</Text>;
  }

  useEffect(() => {
    const handler = (data) => {
      if (data.type === "next-question") {
        setPhase("get-ready");
      } else if (data.type === "go-next-question") {
        dispatch(
          newQuestion({
            index: data.payload.index,
            goodAnswers: data.payload.goodAnswers,
            possibleAnswers: data.payload.possibleAnswers,
            imageURL: data.payload.morphURL,
          })
        );
        setPhase("question");
      }
    };

    socket.on("game-cycle", handler);
    return () => socket.off("game-cycle", handler);
  }, []);

  return <View style={styles.container}>{GameContent}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
