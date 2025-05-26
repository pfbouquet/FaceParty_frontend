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
import Countdown from 'react-native-countdown-component';


const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function Question() {

  const socket = useContext(SocketContext);
  const roomID = useSelector((state) => state.game.value.roomID);

  const [questionData, setQuestionData] = useState(null);

  const [image, setImage] = useState(null);
  const [buttons, setButtons] = useState(null);
  const [roundNumber, setRoundNumber] = useState(0);

  const [buttonsActive, setButtonsActive] = useState(true)
  const [selectedButtonsIndexes, setSelectedButtonsIndexes] = useState([]);
  const [goodAnswers, setGoodAnswers] = useState(null);

  const [nextRound, setNextRound] = useState(null);

  useEffect(() => {
    socket.emit("get-question", (roomID)); //envoi du signal pour récupérer la question stocké sur le serveur
    socket.on("questionText", (data) => {
      setQuestionData(data.payload);
    })

    return () => {
      socket.off("questionText");
    }
  }, []);

  useEffect(() => { //second useEffect permettant d'attendre l'exécution du premier qui ajoute infos dans questionData
    if (questionData) {
      giveQuestion(); // Se déclenche SEULEMENT quand questionData est mis à jour
    }
  }, [questionData, selectedButtonsIndexes, goodAnswers]);


  async function giveQuestion() {

    setRoundNumber(questionData.index); //current round number  
    setImage(<Image style={styles.image} source={{ uri: questionData.imageURL }} />);

    //boucle pour créer dans le 1er des 2 tableaux de réponses possibles les boutons associés
    let possibleAnswers = questionData.possibleAnswers.map(
      (e, i) => {
        return (
          <TouchableOpacity key={i}
            onPress={() => {
              if (!buttonsActive) return;
              if (selectedButtonsIndexes.includes(i)) {
                setSelectedButtonsIndexes(selectedButtonsIndexes.filter(index => index !== i)); //si le bouton est déjà sélectionné, on le désélectionne
              }else if (selectedButtonsIndexes.length < 2) {
                setSelectedButtonsIndexes([...selectedButtonsIndexes, i]); //si le bouton n'est pas sélectionné et qu'on n'a pas encore 2 réponses, on l'ajoute
              }
            }}
              style = { getLeftButtonStyle(i) }
                >
                <Text style={selectedButtonsIndexes.includes(i) ? styles.txtSelect : styles.txt}>{e}</Text>
          </TouchableOpacity >
        );
  }
    );
  setButtons(possibleAnswers); //save jsx of left buttons


}


const getLeftButtonStyle = (index) => {
  if (!goodAnswers) {
    // Sélection en cours
    return selectedButtonsIndexes.includes(index) ? styles.btnSelect : styles.btn;
  }
  // Résultat affiché
  if (goodAnswers.includes(questionData.possibleAnswers[index])) {
    // Bonne réponse
    return styles.btnSelectTrue;
  } else if (selectedButtonsIndexes.includes(index)) {
    // Mauvaise réponse sélectionnée
    return styles.btnSelectFalse;
  } else {
    // Non sélectionné
    return styles.btn;
  }
};

//fonction lancée une fois countdown terminé et chargeant usestate des bonnes réponses
function resultAnswer() {
  setButtonsActive(false); //désactive les boutons une fois le timer terminé
  setGoodAnswers(questionData.goodAnswer);
  setNextRound(
    <TouchableOpacity style={styles.btnNext}>
      <Text>Next round</Text>
    </TouchableOpacity>)
}


return (
  <SafeAreaView style={styles.container}>
    <View style={styles.question}>
      <Text style={styles.round}>Round {roundNumber}</Text>
      {image}
      <Text style={styles.rule}>Sélectionnez les 2 personnes présente dans la photo</Text>

      <Countdown
        until={5}
        onFinish={() => resultAnswer()}
        size={20}
        digitStyle={{ backgroundColor: '#FA725A', color: '#0F3E61' }}
        digitTxtStyle={{ color: '#0f3e61' }}
        timeToShow={['S']}
        timeLabels={{ s: '' }}
        styles={styles.countdown}
      />
      {nextRound}
    </View>

    <View style={styles.answers}>
      {buttons}
    </View>

  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  // Add your styles here
  // Example:
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 350,
    borderRadius: 10,
  },
  round: {
    marginVertical: 10,
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
    backgroundColor: "rgb(6, 174, 39)",
    opacity: 0.8,
    marginTop: 10,
    width: "40%",
    alignItems: "center",
  },
  btnNext: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
})

