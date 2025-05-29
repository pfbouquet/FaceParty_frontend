import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";
import { LinearGradient } from 'expo-linear-gradient';

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const Question = () => {
  const socket = useContext(SocketContext);
  // Get reducers states
  const question = useSelector((state) => state.question.value);
  const game = useSelector((state) => state.game.value);
  const player = useSelector((state) => state.player.value);
  // Create local states
  const [counter, setCounter] = useState(5);
  const [buttonsActive, setButtonsActive] = useState(true);
  const [selectedNames, setSelectedNames] = useState([]);
  const [nextRound, setNextRound] = useState(null);

  useEffect(() => {
    if (counter === 0) {
      resultAnswer();
      return;
    }

    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(timer);
  }, [counter]);

  function sendScoreToDB() {
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/players/addScore`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerID: player.playerID,
        score:
          selectedNames.filter((e) => question.goodAnswers.includes(e)).length *
          10, //score de 0 si aucunes réponses sélectionnés ou si aucune bonnes réponses
      }),
    });
  }

  //fonction au clic sur le bouton START (récupéré dans PlayerLobby)
  function continueParty() {
    socket.emit("game-cycle", { type: "go-scoreboard", roomID: game.roomID }); //transmet le signal de l'admin pour lancer la partie
  }
  // fonction pour naviguer vers la page Podium
  function finishParty() {
    socket.emit("game-cycle", { type: "to-podium", roomID: game.roomID }); //transmet le signal de l'admin pour emètre un socket pour aller sur la page Podium
  }

  //fonction au clic sur le bouton START (récupéré dans PlayerLobby)
  function resultAnswer() {
    setButtonsActive(false);
    sendScoreToDB();

    const lastRound = question.index === game.nbRound - 1;

    if (player.isAdmin && lastRound) {
      setNextRound(
        <TouchableOpacity style={styles.btnNext} onPress={() => finishParty()}>
          <Text style={styles.btntext}>Go to Podium</Text>
        </TouchableOpacity>
      );
    } else if (player.isAdmin) {
      setNextRound(
        <TouchableOpacity
          style={styles.btnNext}
          onPress={() => continueParty()}
        >
          <Text style={styles.btntext}>Next round</Text>
        </TouchableOpacity>
      );
    }
  }

  // FUNCTIONS ------------------------------------------------------------

  // Fonction pour sélectionner les boutons
  const handleSelect = (name) => {
    if (selectedNames.includes(name)) {
      setSelectedNames(selectedNames.filter((n) => n !== name)); // Si le nom est déjà sélectionné, on le désélectionne
    } else if (selectedNames.length < 2) {
      setSelectedNames([...selectedNames, name]); // Si le nom n'est pas sélectionné et qu'on n'a pas encore 2 réponses, on l'ajout
    }
  };

  // VARIABLES ----------------------------------------------------------------

  const buttons = question.possibleAnswers.map((e, i) => {
    const canClick = buttonsActive;
    const isSelected = selectedNames.includes(e);
    const isValid = question.goodAnswers.includes(e);
    let gif = ""
    if (isValid && isSelected && counter === 0) {
      gif = <Image source={require('../assets/true.gif')} style={styles.gif} />;
    } else if (!isValid && isSelected && counter === 0) {
      gif = <Image source={require('../assets/false.gif')} style={styles.gif} />;
    }

    return (
      <LinearGradient colors={['#0F3D62', '#4DA8DA']} style={styles.gradient}>
      <TouchableOpacity
        key={i}
        onPress={() => canClick && handleSelect(e)}
        style={
          styles[
            canClick
              ? !isSelected
                ? "btn"
                : "btnSelect"
              : isValid
              ? "btnSelectTrue"
              : isSelected
              ? "btnSelect"
              : "btn"
          ]
        }
      >
        {gif}
        {/* <Image source={require('../assets/true.gif')} style={styles.gif}/> */}
        <Text style={styles[isSelected ? "txtSelect" : "txt"]}>{e}</Text>
      </TouchableOpacity>
    </LinearGradient>
    );
  });

  // JSX ----------------------------------------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.question}>
        <Text style={styles.round}>
          Round {question.index + 1}/{game.nbRound}
        </Text>
        <Image style={styles.image} source={{ uri: question.imageURL }} />
        <Text style={styles.rule}>
          Sélectionnez les 2 personnes présentes dans la photo
        </Text>

        <Text style={styles.counter}>{counter}</Text>
        {nextRound}
      </View>

      <View style={styles.answers}>{buttons}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Add your styles here
  // Example:
  container: {
    flex: 1,
    justifyContent: "center",
  },
image: {
  width: "100%",
  height: 300,
  maxWidth: 350,
  borderRadius: 50,
  resizeMode: "contain",
  marginTop: "-30%",
},
  round: {
    // marginVertical: 1,
  },
  question: {
    alignItems: "center",
  },
  rule: {
    marginVertical: 10,
  },
  countdown: {
    marginTop: 10,
    marginBottom: 10,
  },
  answers: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    flexWrap: "wrap",
  },
  btn: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 10,
    width: "40%",
    alignItems: "center",
    marginRight: 5,
  },
  txt: {
    fontWeight: "bold",
    color: "#0f3e61",
  },
  btnSelect: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#0F3D61",
    backgroundColor: "rgba(27, 77, 115, 0.7)",
    opacity: 0.8,
    marginTop: 10,
    width: "40%",
    alignItems: "center",
  },
  txtSelect: {
    color: "white",
    fontWeight: "bold",
  },
  btnSelectFalse: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f43311",
    backgroundColor: "rgba(250, 114, 90, 1)",
    opacity: 0.8,
    marginTop: 10,
    width: "40%",
    alignItems: "center",
  },
  txtSelectFalse: {
    color: "black",
  },
  btnSelectTrue: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgb(2, 91, 20)",
    backgroundColor: "#8CBB83",
    opacity: 0.8,
    marginTop: 10,
    width: "40%",
    alignItems: "center",
  },
  btnNext: {
    // borderRadius: 10,
    // borderWidth: 1,
    // marginTop: 10,
    // width: "70%",
    // justifyContent: "center",
    // padding: 20,
    backgroundColor: "#F86F5D",
    paddingVertical: "5%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: "3%",
    alignItems: "center",
    width: "70%",
  },
  btntext:{
    color: "#F1F1F1",
    fontWeight: "bold",
    fontSize: 18,
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
  gif:{
    width: 40,
    height: 40,
    position: "absolute",
    top: -18,
    right: -18,
  },
});
