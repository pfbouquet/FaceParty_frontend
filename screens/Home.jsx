import { StyleSheet, Text, View, Button } from "react-native";
import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

export default function Home({ navigation }) {
  // const { socket } = useContext(SocketContext);

  // Function to create one question in socket (for testing)
  function clickQuestion() {
    // socket.emit("game-cycle", {
    // 	type:"question",
    // 	payload:{questionID:"123456789",
    // 	imageURL:"https://res.cloudinary.com/dat8yzztd/image/upload/v1747390409/soli7celoyncta2u4c4g.jpg",
    // 	goodAnswer:["Toto", "Titi"],
    // 	possibleAnswers:[["Toto", "Marc", "José"],["Titi", "Jean-Claude", "Chuck"]],
    // 	index:2,
    // 	askedAtTime:Date.now(),
    // 	answerHistory:[{playerID:"P1", answer:}]}})
    // navigation.navigate("Question")
    // // Handle question click
    // console.log("Question clicked");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        HOME (créer une partie --ADMIN-- ou rejoindre une partie -- joueur
      </Text>
      <Button
        title="Start a game as Admin"
        onPress={() => navigation.navigate("HomeAdmin")}
      />
      <Button
        title="Go to HomeTuto"
        onPress={() => navigation.navigate("HomeTuto")}
      />
      <Button
        title="Go to PlayerName"
        onPress={() => navigation.navigate("PlayerName")}
      />
      <Button
        title="Go to TabNavigator"
        onPress={() => navigation.navigate("TabNavigator")}
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
});
