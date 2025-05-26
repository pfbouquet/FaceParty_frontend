import React, { useState, useEffect, useRef, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";

export default function StartSound({ navigation }) {
  const [timeLeft, setTimeLeft] = useState(5); // durée du compte à rebours
  const beepSound = useRef(null);
  const finishSound = useRef(null);
  const countdownInterval = useRef(null);
  const socket = useContext(SocketContext);
  const roomID = useSelector((state) => state.game.value.roomID);

  useEffect(() => {
    // Charger les sons
    console.log("StartSound");
    const loadSounds = async () => {
      const { sound: beep } = await Audio.Sound.createAsync(require("../assets/sounds/beep.mp3"));
      beepSound.current = beep;

      const { sound: finish } = await Audio.Sound.createAsync(require("../assets/sounds/countdown-boom.mp3"));
      finishSound.current = finish;
    };

    loadSounds();

    return () => {
      if (beepSound.current) {
        beepSound.current.unloadAsync();
      }
      if (finishSound.current) {
        finishSound.current.unloadAsync();
      }
      socket.off("nextQuestion");
      return () => socket.off("nextQuestion", goToStartSound);
      clearInterval(countdownInterval.current);
    };
  }, []);

  useEffect(() => {
    socket.on("nextQuestion", () => navigation.navigate("Question"));
    return () => socket.off("nextQuestion");
  }, []);

  useEffect(() => {
    const startCountdown = async () => {
      let current = 5;
      setTimeLeft(current);

      // 🔊 Déclenchement du son APRÈS l'affichage du "5"
      setTimeout(async () => {
        if (beepSound.current) {
          try {
            await beepSound.current.replayAsync();
          } catch (e) {
            console.warn("Erreur de lecture audio (initial) :", e);
          }
        }
      }, 0);

      countdownInterval.current = setInterval(async () => {
        current -= 1;
        setTimeLeft(current);

        if (current > 0 && beepSound.current) {
          try {
            await beepSound.current.replayAsync();
          } catch (e) {
            console.warn("Erreur de lecture audio :", e);
          }
        }

        if (current === 0) {
          if (finishSound.current) {
            try {
              await finishSound.current.replayAsync();
            } catch (e) {
              console.warn("Erreur de lecture audio (fin) :", e);
            }
          }
          clearInterval(countdownInterval.current);
          socket.emit("endCountdown", roomID);
        }
      }, 1000);
    };

    startCountdown();

    return () => clearInterval(countdownInterval.current);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>La partie va bientôt commencer !</Text>
      <Text style={styles.countdown}>{timeLeft > 0 ? timeLeft : "FaceParty!"}</Text>
    </View>
  );
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
  countdown: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#FA725A",
  },
});
