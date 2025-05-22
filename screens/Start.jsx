import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Countdown from 'react-native-countdown-component';


export default function Start() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>La partie va bientôt commencer !</Text>
      <Countdown
                until={15}
                // onFinish={() => resultAnswer()}
                size={30}
                digitStyle={{ backgroundColor: '#FA725A', color: '#0F3E61' }}
                digitTxtStyle={{ color: '#0f3e61' }}
                timeToShow={['S']}
                timeLabels={{ s: '' }}
                styles={styles.countdown}
              />
    </View>
  )
}

const styles = StyleSheet.create({
container:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
},
text:{
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
},
})