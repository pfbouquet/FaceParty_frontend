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

  // const [leftBtn1, setLeftBtn1] = useState(false);
  // const [leftBtn2, setLeftBtn2] = useState(false);
  // const [letfBtn3, setLeftBtn3] = useState(false);
  // const [rightBtn1, setRightBtn1] = useState(false);
  // const [rightBtn2, setRightBtn2] = useState(false);
  // const [rightBtn3, setRightBtn3] = useState(false);
  // console.log("leftBtn1", leftBtn1);
  // console.log("leftBtn2", leftBtn2);
  // console.log("letfBtn3", letfBtn3);
  const [selectedLeftIndex, setSelectedLeftIndex] = useState(null);
  const [selectedRightIndex, setSelectedRightIndex] = useState(null);


  //fonction permettant de cliquer sur les boutons de réponse
  // function leftClick(index) {
  //   if ((leftBtn1 && leftBtn2 && letfBtn3) === false) {
  //     const btnClick = "setLeftBtn" + index
  //     btnClick(true);
  //   }
  // }

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
  }, [questionData, selectedLeftIndex, selectedRightIndex]);


  async function giveQuestion() {

    // setTotalRound(data.questions.length); //total number of rounds
    setRoundNumber(questionData.index); //current round number  
    setImage(
      <Image style={styles.image} source={{ uri: questionData.imageURL }} />
    ); // marche pas > laisse espace vide dans l'application

    let leftPossibilities = questionData.possibleAnswers[0].map(
      (e, i) => {
        //boucle pour créer dans le 1er des 2 tableaux de réponses possibles les boutons associés
        return (
          <TouchableOpacity key={i}
            onPress={() => setSelectedLeftIndex(i)}
            style={selectedLeftIndex === i ? styles.btnSelect : styles.btn}
          >
            <Text style={selectedLeftIndex === i ? styles.txtSelect : styles.txt}>{e}</Text>
          </TouchableOpacity>
        );
      }
    );
    setLeftButtons(leftPossibilities); //save jsx of left buttons

    let rightPossibilities = questionData.possibleAnswers[1].map(
      (e, i) => {
        //boucle pour créer dans le 2nd des 2 tableaux de réponses possibles les boutons associés
        return (
          <TouchableOpacity key={i}
            onPress={() => setSelectedRightIndex(i)}
            style={selectedRightIndex === i ? styles.btnSelect : styles.btn}
          >
            <Text style={selectedRightIndex === i ? styles.txtSelect : styles.txt} >{e}</Text>
          </TouchableOpacity>
        );
      }
    );
    setRightButtons(rightPossibilities); //save jsx of right buttons

  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.question}>
        <Text style={styles.title}>Round {roundNumber}/{totalRound}</Text>
        {/* <Image style={styles.image} source={require('../assets/picture1.png')} /> */}
        {image}
        <Text>Choisissez un nom dans chaque colonne</Text>

        <Countdown
          until={10}
          onFinish={() => alert('Terminé !')}
          size={20}
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
  title: {
    marginTop: 10,
  },
  question: {
    alignItems: "center",
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
  },
  leftAnswers: {

  },
  rightAnswers: {

  },
})

