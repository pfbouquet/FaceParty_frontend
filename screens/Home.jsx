import { StyleSheet, Text, View, Button } from "react-native";

export default function Home({ navigation }) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>HOME (créer une partie --ADMIN-- ou rejoindre une partie -- joueur</Text>
			<Button
        title="Start a game as Admin"
        onPress={() => navigation.navigate("HomeAdmin")}
      />
			<Button title="Go to HomeTuto" onPress={() => navigation.navigate("HomeTuto")} />
			<Button title="Go to TabNavigator" onPress={() => navigation.navigate("TabNavigator")} />
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
