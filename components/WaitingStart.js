import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
} from "react-native";
import { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { SocketContext } from "../contexts/SocketContext";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const ScoreBoard = () => {
    const socket = useContext(SocketContext);
    const gameID = useSelector((state) => state.game.value.gameID);
    const roomID = useSelector((state) => state.game.value.roomID);
    const admin = useSelector((state) => state.player.value.isAdmin);
    const question = useSelector((state) => state.question.value);
    const [players, setPlayers] = useState([]);


    return (
        <SafeAreaView style={styles.container}>
            <Image source={require('../assets/logo-faceparty.png')} style={styles.logo}/>
            <Text>Waiting for game to start...</Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    logo:{
        width: 200,
        height: 200,    },
});
