import { StyleSheet, View, Text } from "react-native";
import Countdown from "react-native-countdown-component";
import { useSelector } from "react-redux";
import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

export const GameLifeGetReadyForNextQuestion = () => {
  const player = useSelector((state) => state.player.value);
  const socket = useContext(SocketContext);
  const roomID = useSelector((state) => state.game.value.roomID);


  function endReadyForQuestionCountdown() {
    if (player.isAdmin) {
      socket.emit("end-ready-for-question-countdown", roomID); //transmet le signal de l'admin pour lancer la 1ère question
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Prépare toi à la question i/nbround</Text>
      <Countdown
        until={3}
        onFinish={() => endReadyForQuestionCountdown()}
        size={30}
        digitStyle={{ backgroundColor: "#FA725A", color: "#0F3E61" }}
        digitTxtStyle={{ color: "#0f3e61" }}
        timeToShow={["S"]}
        timeLabels={{ s: "" }}
        styles={styles.countdown}
      />
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
});
