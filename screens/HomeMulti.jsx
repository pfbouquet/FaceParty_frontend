import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function HomeMulti({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HomeMulti</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("NewMultiGame")}
      >
        <Text style={styles.buttonText}>Create new game (admin)</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("JoinMultiGame")}
      >
        <Text style={styles.buttonText}> Join a game</Text>
      </TouchableOpacity>
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
