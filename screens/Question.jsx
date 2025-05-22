import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../contexts/SocketContext";
import Countdown from 'react-native-countdown-component';


const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function Question() {

  const socket = useContext(SocketContext);
  const [questionData, setQuestionData] = useState(null);

  const [image, setImage] = useState(null);
  const [leftButtons, setLeftButtons] = useState(null);
  const [rightButtons, setRightButtons] = useState(null);
  const [roundNumber, setRoundNumber] = useState(0);
  const [totalRound, setTotalRound] = useState(0); //à gérer lorsqu'on enverra plusieurs questions

  const [buttonsActive, setButtonsActive] = useState(true)
  const [selectedLeftIndex, setSelectedLeftIndex] = useState(null);
  const [selectedRightIndex, setSelectedRightIndex] = useState(null);
  const [goodAnswers, setGoodAnswers] = useState(null);

  useEffect(() => {
    socket.on("game-cycle", (data) => {
      setQuestionData(data.payload);
    })

    return () => {
      socket.off("game-cycle");
    }
  }, [socket]);

  useEffect(() => { //second useEffect permettant d'attendre l'exécution du premier qui ajoute infos dans questionData
    if (questionData) {
      giveQuestion(); // Se déclenche SEULEMENT quand questionData est mis à jour
    }
  }, [questionData, selectedLeftIndex, selectedRightIndex, goodAnswers]);


  async function giveQuestion() {

    // setTotalRound(data.questions.length); //total number of rounds
    setRoundNumber(questionData.index); //current round number  
    setImage(<Image style={styles.image} source={{ uri: questionData.imageURL }} />);

    //boucle pour créer dans le 1er des 2 tableaux de réponses possibles les boutons associés
    let leftPossibilities = questionData.possibleAnswers[0].map(
      (e, i) => {
        return (
          <TouchableOpacity key={i}
            onPress={() => { if (buttonsActive) { setSelectedLeftIndex(i) } }}
            style={getLeftButtonStyle(i)}
          >
            <Text style={selectedLeftIndex === i ? styles.txtSelect : styles.txt}>{e}</Text>
          </TouchableOpacity>
        );
      }
    );
    setLeftButtons(leftPossibilities); //save jsx of left buttons

    //boucle pour créer dans le 2nd des 2 tableaux de réponses possibles les boutons associés
    let rightPossibilities = questionData.possibleAnswers[1].map(
      (e, j) => {
        return (
          <TouchableOpacity key={j}
            onPress={() => { if (buttonsActive) { setSelectedRightIndex(j) } }}
            style={getRightButtonStyle(j)}
          >
            <Text style={selectedRightIndex === j ? styles.txtSelect : styles.txt} >{e}</Text>
          </TouchableOpacity>
        );
      }
    );
    setRightButtons(rightPossibilities); //save jsx of right buttons
  }

  //fonction permettant de dynamiser la couleur des boutons de gauche
  const getLeftButtonStyle = (index) => {
    if (!goodAnswers) {
      if (selectedLeftIndex === index) {
        return styles.btnSelect;
      } else {
        return styles.btn;
      }
    }
    if (goodAnswers) {
      if (questionData.goodAnswer[0] === questionData.possibleAnswers[0][index]) {
        return styles.btnSelectTrue;
      } else if (selectedLeftIndex === index) {
        return styles.btnSelectFalse;
      } else {
        return styles.btn;
      }
    }
  };

  //fonction permettant de dynamiser la couleur des boutons de droite
  const getRightButtonStyle = (index2) => {
    if (!goodAnswers) {
      if (selectedRightIndex === index2) {
        return styles.btnSelect;
      } else {
        return styles.btn;
      }
    }
    if (goodAnswers) {
      if (questionData.goodAnswer[1] === questionData.possibleAnswers[1][index2]) {
        return styles.btnSelectTrue;
      } else if (selectedRightIndex === index2) {
        return styles.btnSelectFalse;
      } else {
        return styles.btn;
      }
    }
  };

  //fonction lancée une fois countdown terminé et chargeant usestate des bonnes réponses
  function resultAnswer() {
    setButtonsActive(false); //désactive les boutons une fois le timer terminé
    setGoodAnswers(questionData.goodAnswer);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.question}>
        <Text style={styles.round}>Round {roundNumber}/{totalRound}</Text>
        {/* <Image style={styles.image} source={require('../assets/picture1.png')} /> */}
        {image}
        <Text style={styles.rule}>Choisissez un nom dans chaque colonne</Text>

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
      </View>

      <View style={styles.answers}>
        <View style={styles.leftAnswers}>
          <Text>⬇️ 1ère personne ⬇️</Text>
          {leftButtons}
        </View>

        <View style={styles.rightAnswers}>
          <Text>⬇️ 2ème personne ⬇️</Text>
          {rightButtons}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Add your styles here
  // Example:
  container: {
    flex: 1,
  },
  image: {
    width: "50%",
    height: "50%",
    borderRadius: 10,
  },
  round: {
    marginTop: 10,
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
  },
  btn: {
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "gray",
    marginTop: 10,
    width: "100%",
    alignItems: "center",
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
    width: "100%",
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
    width: "100%",
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
    width: "100%",
    alignItems: "center",
  },
  leftAnswers: {

  },
  rightAnswers: {

  },
})

