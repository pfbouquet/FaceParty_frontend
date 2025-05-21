import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../contexts/SocketContext";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function Question() {

  const socket = useContext(SocketContext);
  const [questionData, setQuestionData] = useState(null);
  console.log('usestate questionData =>', questionData)


  const [image, setImage] = useState(null);
  const [leftButtons, setLeftButtons] = useState(null);
  const [rightButtons, setRightButtons] = useState(null);
  const [roundNumber, setRoundNumber] = useState(0);
  const [totalRound, setTotalRound] = useState(0);
  console.log('usestate leftButtons and RIGHT =>', leftButtons, rightButtons)


  useEffect(() => {
    socket.on("game-cycle", (data) => {
      console.log('data payload =>', data.payload)
      setQuestionData(data.payload);
    })

    giveQuestion(); //récupère les informations de la question stocké dans le useState questionData

    return () => {
      socket.off("game-cycle");
    }
  }, [socket]);

  async function giveQuestion() {

    setImage(
      <Image style={styles.image} source={{ uri: questionData.imageURL }} />
    ); // marche pas > laisse espace vide dans l'application

    let leftPossibilities = questionData.possibleAnswers[0].map(
      (e, i) => {
        //boucle pour créer dans le 1er des 2 tableaux de réponses possibles les boutons associés
        return (
          <TouchableOpacity
            onPress={() => giveQuestion()}
            style={styles.btn}
          >
            <Text key={i}>{e}</Text>
          </TouchableOpacity>
        );
      }
    );
    setLeftButtons(leftPossibilities); //save jsx of left buttons

    let rightPossibilities = questionData.possibleAnswers[1].map(
      (e, i) => {
        //boucle pour créer dans le 2nd des 2 tableaux de réponses possibles les boutons associés
        return (
          <TouchableOpacity
            onPress={() => giveQuestion()}
            style={styles.btn}
          >
            <Text key={i}>{e}</Text>
          </TouchableOpacity>
        );
      }
    );
    setRightButtons(rightPossibilities); //save jsx of right buttons

    // setTotalRound(data.questions.length); //total number of rounds
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.question}>
        <Text style={styles.title}>Round 1/{totalRound}</Text>
        {/* <Image style={styles.image} source={require('../assets/picture1.png')} /> */}
        {image}
        <Text>Choisissez un nom dans chaque colonne</Text>
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
    width: 200,
    height: 500,
    borderRadius: 10,
    flex: 1,
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
    marginTop: 20,
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
  leftAnswers: {

  },
  rightAnswers: {

  },
});
