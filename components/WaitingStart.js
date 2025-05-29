import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Animated,
    Easing,
    Image,
} from "react-native";

export const WaitingStart = () => {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 3000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const messages = [
        "Génération des mix de vos visages...",
        "Chargement des confettis",
        "Eradication des inégalités salariales",
        "Dégustation imminente des saucisses !",
        "Inversement du réchauffement climatique",
        "Préparation de la fête...",
        "Sois patient, nous y sommes presque !",
    ];
    const [messageIndex, setMessageIndex] = React.useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animateMessage = () => {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.delay(1500),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setMessageIndex(prev => (prev + 1) % messages.length);
            });
        };
        animateMessage();
    }, [messageIndex, fadeAnim, messages.length]);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <TouchableOpacity>
                    <Animated.Image
                        source={require('../assets/logo-faceparty.png')}
                        style={[styles.logo, { transform: [{ rotate: spin }] }]}
                    />
                </TouchableOpacity>
            </View>
            <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
                {messages[messageIndex]}
            </Animated.Text>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    text: {
        fontSize: 20,
        color: '#0f3e61',
        textAlign: 'center',
        marginTop: 20,
    },
});