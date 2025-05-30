import { StyleSheet, Text, View, Image, Platform, StatusBar /*, ScrollView*/ } from "react-native"; // ScrollView commenté
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { newQuestion } from "../reducers/question";
import { SocketContext } from "../contexts/SocketContext";

import { GameLifeGetReadyForNextQuestion } from "../components/GameLifeGetReadyForNextQuestion";
import { Question } from "../components/Question";
import { ScoreBoard } from "../components/ScoreBoard";
import { WaitingStart } from "../components/WaitingStart";

import logo from "../assets/logo-faceparty.png";

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
      } else if (data.type === "to-podium") {
        navigation.replace("Podium");
      }
    };

    socket.on("game-cycle", handler);
    return () => socket.off("game-cycle", handler);
  }, []);

  let GameContent = <WaitingStart />;
  if (phase === "question-get-ready") {
    GameContent = <GameLifeGetReadyForNextQuestion />;
  } else if (phase === "question") {
    GameContent = <Question navigation={navigation} />;
  } else if (phase === "scoreboard") {
    GameContent = <ScoreBoard />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <View style={styles.statusBarSpacer} /> */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>FaceParty</Text>
      </View>

      <View style={styles.wrapper}>
            {GameContent}
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
    paddingHorizontal: 16,
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
    color: "#FFFFFF",
  },
  wrapper: {
    flex: 1,
    // padding: 16,
  },
  contentBox: {
    width: "100%",
    maxWidth: 800,
    // borderWidth: 2,
    // borderColor: "#0F3D62",
    // borderRadius: 16,
    // backgroundColor: "#FFFFFF",
    // padding: 16,
  },
});
