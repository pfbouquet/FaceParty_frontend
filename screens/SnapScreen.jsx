import {
  StyleSheet,
  View,
  Dimensions,
  Pressable,
  Image,
  Button,
  ImageBackground,
  Animated,
  Text,
} from "react-native";
import { useEffect, useState, useContext, useRef } from "react";
import { CameraView, Camera } from "expo-camera";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
import { SocketContext } from "../contexts/SocketContext";
// Load reducers
import { useDispatch, useSelector } from "react-redux";
import { addPicture } from "../reducers/player";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const { width } = Dimensions.get("window");
const FRAME_SIZE = width * 0.65;

export default function SnapScreen({ navigation }) {
  //----------------------------------------------
  //VARIABLES ------------------------------------
  //----------------------------------------------
  const socket = useContext(SocketContext);
  const [hasPermission, setHasPermission] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const { playerID } = useSelector((state) => state.player.value);
  const { roomID } = useSelector((state) => state.game.value);
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const dispatch = useDispatch();

  //Animation pour la bordure de l'encart photo
  const borderAnim = useRef(new Animated.Value(0)).current;
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F86F5D", "#0F3D62"], // orange <-> bleu
  });

  //----------------------------------------------
  //USEEFFECT ------------------------------------
  //----------------------------------------------

  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result?.status === "granted");
    })();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [borderAnim]);

  //----------------------------------------------
  //FONCTIONS ------------------------------------
  //----------------------------------------------
  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 });
    if (photo) setPhotoUri(photo.uri);
  };

  const handleConfirm = () => {
    if (!playerID) {
      alert("Erreur : playerID manquant");
      return;
    }

    dispatch(addPicture(photoUri));

    const formData = new FormData();
    formData.append("photoFromFront", {
      uri: photoUri,
      name: "photo.jpg",
      type: "image/jpeg",
    });
    formData.append("playerID", playerID);

    fetch(`${EXPO_PUBLIC_BACKEND_URL}/selfie/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.result) {
          socket.emit("player-update", roomID);
          navigation.navigate("PlayerLobby");
        } else {
          alert("Erreur lors de l'envoi");
        }
      })
      .catch((err) => {
        console.error("Erreur réseau:", JSON.stringify(err, null, 2));
      });
  };

  if (!hasPermission || !isFocused) return <View />;

  if (photoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
        <View style={styles.buttonRow}>
          <Button title="Reprendre" onPress={() => setPhotoUri(null)} />
          <Button title="Confirmer" onPress={() => handleConfirm()} />
        </View>
      </View>
    );
  }

  //----------------------------------------------
  //JSX ------------------------------------------
  //----------------------------------------------
  return (
    <ImageBackground style={styles.overlay}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Prends-toi en photo !</Text>
        <Text style={styles.subtitle}>
          Tu pourras recommencer si tu n'es pas satisfait.
        </Text>
      </View>
      <Animated.View style={[styles.centerContainer, { borderColor }]}>
        <CameraView
          style={styles.camera}
          facing="front"
          ref={(ref) => (cameraRef.current = ref)}
          zoom={0.2}
        />
      </Animated.View>
      <View style={styles.notice}>
        <Text style={styles.titleNotice}>Pour un quizz optimal :</Text>
        <Text style={styles.infoNotice}>😳 Ne souris pas</Text>
        <Text style={styles.infoNotice}>🤪 Ne fais pas de grimace</Text>
        <Text style={styles.infoNotice}>🤓 Retire tes lunettes</Text>
        <Text style={styles.infoNotice}>😮‍💨 N'oublie pas de respirer</Text>
      </View>
      <View style={styles.delimiter}>
        <Pressable
          onPress={takePicture}
          style={({ pressed }) => [
            { opacity: pressed ? 0.6 : 1 },
            styles.button,
          ]}
        >
          <Animated.View style={[styles.circle, { borderColor }]}>
            <FontAwesome name="camera" size={50} color="#F86F5D" />
          </Animated.View>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#F1F1F1",
  },
  delimiter: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  // ---------------------------------------------------
  // Styles for the title container --------------------
  // ---------------------------------------------------
  titleContainer: {
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "rgba(27, 77, 115, 1)",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    color: "rgba(27, 77, 115, 1)",
    fontSize: 16,
  },
  // ---------------------------------------------------
  // Styles for the Notice informations ----------------
  // ---------------------------------------------------
  notice: {
    width: "80%",
    height: 150,
    backgroundColor: "rgba(27, 77, 115, 1)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  titleNotice: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoNotice: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
  },
  // ---------------------------------------------------
  // Styles for the camera container and button---------
  // ---------------------------------------------------
  centerContainer: {
    width: FRAME_SIZE * 1.1,
    height: FRAME_SIZE * 1.5,
    borderRadius: FRAME_SIZE * 0.67,
    overflow: "hidden",
    borderWidth: 8,
    borderColor: "rgba(250, 114, 90, 1)",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "90%",
    height: "70%",
    borderRadius: 20,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: "absolute",
    borderWidth: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    zIndex: 1,
  },
});
