import { StyleSheet, Text, View, Button } from "react-native";

export default function HomeTuto({ navigation }) {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>HomeTuto</Text>
			<Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
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
