import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { newQuestion } from "../reducers/question";
import { SocketContext } from "../contexts/SocketContext";
import { GameLifeGetReadyForNextQuestion } from "../components/GameLifeGetReadyForNextQuestion";
import { Question } from "../components/Question";
import { ScoreBoard } from "../components/ScoreBoard";

export default function GameLifeScreen({ navigation }) {
  const socket = useContext(SocketContext);
  const [phase, setPhase] = useState("game-preparation");

  const dispatch = useDispatch();

  useEffect(() => {
    const handler = (data) => {
      if (data.type === "next-question") {
        dispatch(
          newQuestion({
            index: data.payload.index,
            goodAnswers: data.payload.goodAnswers,
            possibleAnswers: data.payload.possibleAnswers,
            imageURL: data.payload.imageURL,
          })
        );
        setPhase("question-get-ready");
      } else if (data.type === "go-question") {
        setPhase("question");
      } else if (data.type === "go-scoreboard") {
        setPhase("scoreboard");
      }
    };

    socket.on("game-cycle", handler);
    return () => socket.off("game-cycle", handler);
  }, []);

  let GameContent = <Text>Waiting for game to start...</Text>;

  if (phase === "question-get-ready") {
    GameContent = <GameLifeGetReadyForNextQuestion />;
  } else if (phase === "question") {
    GameContent = <Question />;
  } else if (phase === "scoreboard") {
    GameContent = <ScoreBoard />;
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
