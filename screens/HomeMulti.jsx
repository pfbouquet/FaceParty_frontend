import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
// load reducers
import { useDispatch } from "react-redux";
import { resetGame } from "../reducers/game";
import { resetPlayer } from "../reducers/player";
import { resetQuestion } from "../reducers/question";

export default function HomeMulti({ navigation }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // reset reducers when entering the HomeMulti screen
    dispatch(resetGame());
    dispatch(resetPlayer());
    dispatch(resetQuestion());
  }, []);

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
