import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

export default function Home({ navigation }) {
  const socket = useContext(SocketContext);

  // Function to create one question in socket (for testing)
  function clickQuestion() {
    navigation.navigate("Question");

    socket.emit("question", {
      type: "question",
      payload: {
        questionID: "123456789",
        imageURL:
          "https://res.cloudinary.com/dat8yzztd/image/upload/v1747390409/soli7celoyncta2u4c4g.jpg",
        goodAnswer: ["Toto", "Titi"],
        possibleAnswers: [
          ["Toto", "Marc", "José"],
          ["Titi", "Jean-Claude", "Chuck"],
        ],
        index: 2,
        askedAtTime: Date.now(),
        answerHistory: [
          {
            playerID: "P1",
            answer: ["José", "Titi"],
            answeredAtTime: Date.now(),
          },
        ],
      },
    });

    // Handle question click
    console.log("Question clicked");
  }

  // console.log(socket);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HOME</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("HomeMulti")}
      >
        <Text style={styles.buttonText}>Multiplayer</Text>
      </TouchableOpacity>
      <Button
        title="Go to PlayerName"
        onPress={() => navigation.navigate("PlayerName")}
      />
      <Button title="Go to QUESTION" onPress={() => clickQuestion()} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Add your styles here
  // Example:
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5c3f81",
    width: "50%",
    height: 70,
    alignItems: "center",
	justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
