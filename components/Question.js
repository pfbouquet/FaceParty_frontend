// Composant React Native gérant chaque question de quiz avec timer, sélection de réponses et envoi du score.
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Image } from 'expo-image'; // pour gestion des gifs notamment
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const Question = () => {
  const socket = useContext(SocketContext);// Récupère le socket
  // Get reducers states
  const question = useSelector((state) => state.question.value);
  const game = useSelector((state) => state.game.value);
  const player = useSelector((state) => state.player.value);
  // Create local states
  const [counter, setCounter] = useState(7);
  const [buttonsActive, setButtonsActive] = useState(true);
  const [selectedNames, setSelectedNames] = useState([]);
  const [nextRound, setNextRound] = useState(null);

  // Timer avec décrémentation toutes les secondes
  useEffect(() => {
    if (counter === 0) {
      resultAnswer(); // Déclenche la logique de réponse à 0 seconde
      return;
    }

    const timer = setTimeout(() => setCounter(counter - 1), 1000);
    return () => clearTimeout(timer); // Nettoyage du timer à chaque mise à jour
  }, [counter]);

  // FUNCTIONS ------------------------------------------------------------

  // Envoie les points gagnés au backend et donc sur MongoDB
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
          10, //score de 0 si aucunes réponses sélectionnés ou si aucune bonnes réponses et 10 par bonne réponse
      }),
    });
  }

  // L’admin passe au tableau des scores
  function continueParty() {
    socket.emit("game-cycle", { type: "go-scoreboard", roomID: game.roomID }); //transmet le signal de l'admin pour lancer la partie
  }
  // L’admin termine la partie et affiche le podium
  function finishParty() {
    socket.emit("game-cycle", { type: "to-podium", roomID: game.roomID }); //transmet le signal de l'admin pour emètre un socket pour aller sur la page Podium
  }

  // Traite la fin du tour : envoie score, désactive, affiche bouton admin
  function resultAnswer() {
    setButtonsActive(false);
    sendScoreToDB();

    const lastRound = question.index === game.nbRound - 1;

    if (player.isAdmin && lastRound) { // si dernier round > go Podium
      setNextRound(
        <TouchableOpacity style={styles.btnNext} onPress={() => finishParty()}>
          <Text style={styles.btntext}>Go to Podium</Text>
        </TouchableOpacity>
      );
    } else if (player.isAdmin) { // s'il reste des rounds > Next round
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

  // Fonction pour sélectionner les boutons/choix de la question
  const handleSelect = (name) => {
    if (selectedNames.includes(name)) {
      setSelectedNames(selectedNames.filter((n) => n !== name)); // Si le nom est déjà sélectionné, on le désélectionne
    } else if (selectedNames.length < 2) {
      setSelectedNames([...selectedNames, name]); // Si le nom n'est pas sélectionné et qu'on n'a pas encore 2 réponses, on l'ajoute
    }
  };

  // Gestion dynamique de l'aspect des boutons de réponses
  const buttons = question.possibleAnswers.map((e, i) => {
    const canClick = buttonsActive; // Vérifie si les boutons sont encore cliquables (temps non écoulé)
    const isSelected = selectedNames.includes(e); // Vérifie si cette réponse a été sélectionnée par le joueur
    const isValid = question.goodAnswers.includes(e); // Vérifie si cette réponse est une bonne réponse
    let gif = ""

    // Affiche un gif true ou false en fonction de la validité de la réponse à la fin du timer
    if (isValid && isSelected && counter === 0) {
      gif = <Image source={require('../assets/true.gif')} style={styles.gif} />;
    } else if (!isValid && isSelected && counter === 0) {
      gif = <Image source={require('../assets/false.gif')} style={styles.gif} />;
    }

    const displayText = e.length > 10 ? `${e.substring(0, 10)}...` : e; // tronque les prénoms trop long 

    // Génère dynamiquement les boutons de réponse : active le style et le GIF selon l'état du bouton (cliquable, sélectionné, correct/incorrect) et la fin du timer
    return (
      <TouchableOpacity
        key={i}
        onPress={() => canClick && handleSelect(e)}
        style={
          styles[
          canClick
            ? !isSelected // pas sélectionné
              ? "btn" //style par défaut
              : "btnSelect" // si sélectionné > style Select
            : isValid // fin timer
              ? "btnSelectTrue" // style bonne réponse
              : isSelected // si choix sélectionné
                ? "btnSelect" // style réponse incorrect = style select
                : "btn" //style neutre
          ]
        }
      >
        {gif}
        <Text style={styles[isSelected ? "txtSelect" : "txt"]}>{displayText}</Text>
      </TouchableOpacity>
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
    backgroundColor: "#F86F5D",
    paddingVertical: "5%",
    borderRadius: 10,
    alignItems: "center",
    marginTop: "3%",
    width: "70%",
  },
  btntext: {
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
  gif: {
    width: 40,
    height: 40,
    position: "absolute",
    top: -18,
    right: -18,
  },
});
