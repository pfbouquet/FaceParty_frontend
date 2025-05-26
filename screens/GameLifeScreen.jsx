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
  const [phase, setPhase] = useState("game-preparation");

  const dispatch = useDispatch();

  useEffect(() => {
    const handler = (data) => {
      switch (data.type) {
        case "next-question":
          dispatch(
            newQuestion({
              index: data.payload.index,
              goodAnswers: data.payload.goodAnswers,
              possibleAnswers: data.payload.possibleAnswers,
              imageURL: data.payload.morphURL,
            })
          );
          setPhase("question-get-ready");
          break;
        case "go-question":
          setPhase("question");
          break;
        case "go-scoreboard":
          setPhase("scoreboard");
          break;
      }
    };

    socket.on("game-cycle", handler);
    return () => socket.off("game-cycle", handler);
  }, []);

  let GameContent = <Text>Waiting for game to start...</Text>;

  if (phase === "question-get-ready") {
    GameContent = <GameLifeGetReadyForNextQuestion />;
  } else if (phase === "question") {
    GameContent = <Text>Next question</Text>;
  }

  return <View style={styles.container}>{GameContent}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
