import { StyleSheet, Text, View, TouchableOpacity, Image, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/logo-faceparty.png";

export default function HomeMulti({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.statusBarSpacer} />
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>FaceParty</Text>
      </View>
      <View style={styles.container}>
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
          <Text style={styles.buttonText}>Join a game</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F1F1F1",
  },
  statusBarSpacer: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // paddingHorizontal: 16,
    width: "100%",
    paddingVertical: 12,
    backgroundColor: "#0F3D62",
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "600",
    color: "#F1F1F1",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#0F3D62",
    width: "70%",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
