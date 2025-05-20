import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

export default function PlayerName({ navigation }) {
  const [playerName, setPlayerName] = useState("");
  const playerID = "682c986c3faa881ff6c9abea";
  // const gameID = "682c986c3faa881ff6c9abe8";

  const handleSubmit = () => {
    if (playerName.length === 0) {
      return;
    }

    fetch("http://192.168.100.236:3000/players/updateName", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        playerID: playerID,
        playerName: playerName,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.message);
        if (data.result) {
          // On navigue vers PlayerLobby sans props
          navigation.navigate("PlayerLobby");
        } else {
          alert("Erreur lors de la mise à jour du nom.");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Erreur réseau.");
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PlayerNameInput</Text>
      <TextInput placeholder="Player name" onChangeText={(value) => setPlayerName(value)} value={playerName} style={styles.input} />
      <TouchableOpacity onPress={handleSubmit} style={styles.button} activeOpacity={0.8}>
        <Text style={styles.textButton}>I'm OK with my name</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  input: {
    width: 200,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
  },
  textButton: {
    color: "#fff",
    fontWeight: "bold",
  },
});

//////////////////////////// OLD CODE ////////////////////////////

// import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from "react-native";
// import { useState } from 'react';

// export default function PlayerName({ navigation }) {
//   const [playerName, setPlayerName] = useState('');
//   const playerID = '137be52145b7e7068b3b2453';

//   const handleSubmit = () => {
//     if (playerName.length === 0) {
//       return;
//     }

//     fetch('http://192.168.100.236:3000/players/updateName', {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         playerID: playerID,
//         playerName: playerName,
//       }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data.message);
//       })
//       navigation.navigate("PlayerLobby")}
//       .catch((err) => console.error(err));
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>PlayerNameInput</Text>
//       <TextInput
//         placeholder="Player name"
//         onChangeText={(value) => setPlayerName(value)}
//         value={playerName}
//         style={styles.input}
//       />
//       <TouchableOpacity onPress={handleSubmit} style={styles.button} activeOpacity={0.8}>
//         <Text style={styles.textButton}>I'm OK with my name</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   input: {
//     width: 200,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginVertical: 10,
//     borderRadius: 5,
//   },
//   button: {
//     backgroundColor: "#3498db",
//     padding: 10,
//     borderRadius: 5,
//   },
//   textButton: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
// });
