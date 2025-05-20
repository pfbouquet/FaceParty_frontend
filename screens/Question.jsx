import { StyleSheet, Text, View, Button, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { useEffect, useState } from "react";

export default function Question() {

	const BACKEND_URL = "http://192.168.100.66:3000";

	const [image, setImage] = useState(null)
	const [leftButtons, setLeftButtons] = useState(null)
	const [rightButtons, setRightButtons] = useState(null)
	const [roundNumber, setRoundNumber] = useState(0)
	const [totalRound, setTotalRound] = useState(0)
	console.log(roundNumber)


	useEffect(() => {
		giveQuestion()
	}, [])

	async function giveQuestion() {
		fetch(`${BACKEND_URL}/questions/682c952fc4372e9621a7c7e3`)
			.then(response => response.json())
			.then((data) => {
				console.log('giveQuestion => ', data.questions.length)
				setImage(<Image style={styles.image} source={data.questions[0].imageURL} />) // marche pas > laisse espace vide dans l'application

				let leftPossibilities = data.questions[0].possibleAnswers[0].map((e, i) => { //boucle pour créer dans le 1er des 2 tableaux de réponses possibles les boutons associés
					return <TouchableOpacity onPress={() => giveQuestion()} style={styles.btn}>
						<Text key={i}>{e}</Text>
					</TouchableOpacity>
				})
				setLeftButtons(leftPossibilities) //save jsx of left buttons

				let rightPossibilities = data.questions[0].possibleAnswers[1].map((e, i) => { //boucle pour créer dans le 2nd des 2 tableaux de réponses possibles les boutons associés
					return <TouchableOpacity onPress={() => giveQuestion()} style={styles.btn}>
						<Text key={i}>{e}</Text>
					</TouchableOpacity>
				})
				setRightButtons(rightPossibilities) //save jsx of right buttons
				setTotalRound(data.questions.length) //total number of rounds
			})
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
		height: '50%',
		width: '50%',
	},
	title: {
		marginTop: 10,
	},
	question: {
		alignItems: 'center',
	},
	answers: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
	btn: {
		padding: 20,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: 'gray',
		marginTop: 10,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	leftAnswers: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	rightAnswers: {
		justifyContent: 'center',
		alignItems: 'center',
	},
});
