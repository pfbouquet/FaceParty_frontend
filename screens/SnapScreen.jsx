import React from "react";
import { CameraView, Camera } from "expo-camera";
import { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Dimensions, Pressable, ImageBackground } from "react-native";
import { useDispatch } from "react-redux";
import { addPitcure } from "../reducers/user";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";
const { width } = Dimensions.get("window");
const FRAME_SIZE = width * 0.65;

export default function SnapScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result?.status === "granted");
    })();
  }, []);

  if (!hasPermission || !isFocused) {
    return <View />;
  }

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 });
    photo && dispatch(addPitcure(photo.uri));
    navigation.navigate("PlayerLobby");
  };

  return (
    <ImageBackground style={styles.overlay}>
      <View style={styles.delimiter} />
      <View style={styles.centerContainer}>
        <CameraView style={styles.camera} facing="front" ref={(ref) => (cameraRef.current = ref)} zoom={0.2} />
      </View>
      <View style={styles.delimiter}>
        <Pressable onPress={takePicture} style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }, styles.button]}>
          <FontAwesome name="circle-thin" size={100} />
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
    justifyContent: "space-between",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  delimiter: {
    width: "100%",
    height: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    width: FRAME_SIZE,
    height: FRAME_SIZE * 1.3,
    borderRadius: FRAME_SIZE * 0.65,
    overflow: "hidden",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  button: {
    color: "black",
    justifyContent: "center",
    alignItems: "center",
  },
});
