import { StyleSheet, View, Text, Animated, Easing, TouchableOpacity, Button } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useState, useEffect, useRef } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { Audio } from 'expo-av';
import React from "react";

export const GameLifeGetReadyForNextQuestion = () => {
  // ------------------------------------------------------------
  // VARIABLES---------------------------------------------------
  // ------------------------------------------------------------
  const player = useSelector((state) => state.player.value);
  const socket = useContext(SocketContext);
  const roomID = useSelector((state) => state.game.value.roomID);
  const game = useSelector((state) => state.game.value);
  const question = useSelector((state) => state.question.value); //utile pour récupérer l'index de la question
  const [counter, setCounter] = useState(null);
  const soundBeep = useRef(null); // bip
  const soundFinish = useRef(null); // son de fin
  const [isBeepSoundReady, setIsBeepSoundReady] = useState(false);
  const [isFinishSoundReady, setIsFinishSoundReady] = useState(false);


  const spinValue = useRef(new Animated.Value(0)).current;
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // ------------------------------------------------------------
  // USEEFFECT---------------------------------------------------
  // ------------------------------------------------------------
  //Lancement animation spin logo
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  //Chargement des soundeffects
  useEffect(() => {
    Audio.setAudioModeAsync({ //force le son sur IOS
      playsInSilentModeIOS: true,
    });

    const loadBeep = async () => {
      const { sound: beep } = await Audio.Sound.createAsync(
        require('../assets/sounds/beep.mp3')
      );
      soundBeep.current = beep;
      setIsBeepSoundReady(true);

    };
    loadBeep();

    const loadFinish = async () => {
      const { sound: finish } = await Audio.Sound.createAsync(
        require('../assets/sounds/countdown-boom.mp3')
      );
      soundFinish.current = finish;
      setIsFinishSoundReady(true);
    };
    loadFinish();

    return () => {
      soundBeep.current?.unloadAsync();
      soundFinish.current?.unloadAsync();
    };
  }, []);

  // lancement du compteur quand les sons sont chargés
  useEffect(() => {
    if (isBeepSoundReady && isFinishSoundReady) {
      setCounter(3);
    }
  }, [isBeepSoundReady, isFinishSoundReady]);

  // Actions à effectuer à chaque seconde du compteur
  useEffect(() => {
    if (!isBeepSoundReady || !isFinishSoundReady) return;

    if (counter === 0) {
      const playFinish = async () => {
        try {
          if (soundFinish.current) {
            await soundFinish.current.replayAsync();

          }
        } catch (e) {
          console.warn('Erreur :', e);
        }
      };
      playFinish()

      if (player.isAdmin) {
        socket.emit("game-cycle", { type: "go-question", roomID: roomID });
      }
      return;
    }

    const playBeep = async () => {
      try {
        if (soundBeep.current) {
          await soundBeep.current.stopAsync();     // STOP le beep précédent
          await soundBeep.current.replayAsync();

        }
      } catch (e) {
        console.warn('Erreur :', e);
      }
    };
    playBeep()

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
