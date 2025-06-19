// Composant WaitingStart : écran d'attente animé affichant un logo tournant et du texte
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
    // --------------------------------------------------------------------------
    // VARIABLES ----------------------------------------------------------------
    // --------------------------------------------------------------------------
    const [messageIndex, setMessageIndex] = React.useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const spinValue = useRef(new Animated.Value(0)).current;
    const isMounted = useRef(true);

    // Interpolation : convertit la valeur animée (0 à 1) en degrés (0° à 360°) pour faire tourner le logo
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // Liste des messages à afficher
    const messages = [
        "Génération des mix de vos visages...",
        "Chargement des confettis",
        "Eradication des inégalités salariales",
        "Dégustation imminente des saucisses !",
        "Inversement du réchauffement climatique",
        "Préparation de la fête...",
        "Sois patient, nous y sommes presque !",
    ];

    // --------------------------------------------------------------------------
    // USEEFFECT ----------------------------------------------------------------
    // --------------------------------------------------------------------------
    // Animation du logo en boucle
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

    // Animation en boucle de l'affichage des messages avec fondu
    useEffect(() => {
        isMounted.current = true;
        let animation;

        // fonction contenant les animations fondu des messages
        const animateMessage = () => {
            animation = Animated.sequence([
                Animated.timing(fadeAnim, { //apparition message
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.delay(1500), // pause
                Animated.timing(fadeAnim, { // disparition message
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
            animation.start(({ finished }) => { // lance l'animation animateMessage() et incrémente l'index pour relancer un autre message
                if (isMounted.current && finished) {
                    setMessageIndex(prev => (prev + 1) % messages.length);
                    animateMessage();
                }
            });
        };
        animateMessage(); // Lance la première animation au montage du composant

        // évite nouveaux render si composant démonté pour passage au décompte
        return () => {
            isMounted.current = false;
            fadeAnim.stopAnimation();
            if (animation) animation.stop();
        };
    }, []);

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