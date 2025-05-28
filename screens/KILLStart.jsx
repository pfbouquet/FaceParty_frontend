
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Countdown from 'react-native-countdown-component';
import { useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";

export default function Start({ navigation }) {
  const socket = useContext(SocketContext);
  const roomID = useSelector((state) => state.game.value.roomID);

  useEffect(() => {
    socket.on("nextQuestion", () => navigation.navigate("Question")); //écoute le signal de lancement plus bas pour passer au screen Question

    return () => socket.off("nextQuestion");
  }, []);

  function goToQuestion() {
    socket.emit("endCountdown", roomID); //transmet le signal de l'admin pour lancer la 1ère question 
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>La partie va bientôt commencer !</Text>
      <Countdown
        until={3}
        onFinish={() => goToQuestion()}
        size={30}
        digitStyle={{ backgroundColor: '#FA725A', color: '#0F3E61' }}
        digitTxtStyle={{ color: '#0f3e61' }}
        timeToShow={['S']}
        timeLabels={{ s: '' }}
        styles={styles.countdown}
      />
    </View>
  )
}

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
})
