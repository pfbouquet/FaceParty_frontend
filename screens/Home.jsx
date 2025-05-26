import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { useContext, useEffect } from "react";
import { SocketContext } from "../contexts/SocketContext";
import { useSelector } from "react-redux";


export default function Home({ navigation }) {
 
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
