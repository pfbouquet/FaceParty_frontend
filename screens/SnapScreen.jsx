import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Pressable,
  Image,
  Button,
  ImageBackground,
} from "react-native";
import { CameraView, Camera } from "expo-camera";
import { useDispatch } from "react-redux";
import { addPitcure } from "../reducers/user";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native";

const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

const { width } = Dimensions.get("window");
const FRAME_SIZE = width * 0.65;

// const formData = new FormData();

export default function SnapScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const isFocused = useIsFocused();
  const cameraRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result?.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 });
    if (photo) setPhotoUri(photo.uri);
  };

  const handleConfirm = () => {
    dispatch(addPitcure(photoUri)); // Redux update
  
    const formData = new FormData(); // ✅ instanciation
    formData.append("photoFromFront", {
      uri: photoUri,
      name: "photo.jpg",
      type: "image/jpeg",
    });
  
    console.log("POST vers :", `${EXPO_PUBLIC_BACKEND_URL}/upload`);
    console.log("photoUri:", photoUri);
  
    fetch(`${EXPO_PUBLIC_BACKEND_URL}/selfie/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then(async (res) => {
        const txt = await res.text();
        console.log("Réponse brute:", txt);
        return JSON.parse(txt);
      })
      .then((data) => {
        console.log("Réponse JSON:", data);
        if (data.result) {
          navigation.navigate("PlayerLobby");
        } else {
          alert("Erreur lors de l'envoi");
        }
      })
      .catch((err) => {
        console.error("Erreur réseau:", JSON.stringify(err, null, 2));
        alert("Erreur réseau");
      });
  };

  if (!hasPermission || !isFocused) return <View />;

  if (photoUri) {
    return (
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.previewImage} />
        <View style={styles.buttonRow}>
          <Button title="Reprendre" onPress={() => setPhotoUri(null)} />
          <Button title="Confirmer" onPress={handleConfirm} />
        </View>
      </View>
    );
  }

  return (
    <ImageBackground style={styles.overlay}>
      <View style={styles.delimiter} />
      <View style={styles.centerContainer}>
        <CameraView
          style={styles.camera}
          facing="front"
          ref={(ref) => (cameraRef.current = ref)}
          zoom={0.2}
        />
      </View>
      <View style={styles.delimiter}>
        <Pressable
          onPress={takePicture}
          style={({ pressed }) => [
            { opacity: pressed ? 0.6 : 1 },
            styles.button,
          ]}
        >
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
});


// import React, { useEffect, useState, useRef } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   Dimensions,
//   Pressable,
//   Image,
//   Button,
//   ImageBackground,
// } from "react-native";
// import { CameraView, Camera } from "expo-camera";
// import { useDispatch } from "react-redux";
// import { addPitcure } from "../reducers/user";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import { useIsFocused } from "@react-navigation/native";

// const EXPO_PUBLIC_BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

// const { width } = Dimensions.get("window");
// const FRAME_SIZE = width * 0.65;

// export default function SnapScreen({ navigation }) {
//   const [hasPermission, setHasPermission] = useState(false);
//   const [photoUri, setPhotoUri] = useState(null);
//   const isFocused = useIsFocused();
//   const cameraRef = useRef(null);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     (async () => {
//       const result = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(result?.status === "granted");
//     })();
//   }, []);

//   const takePicture = async () => {
//     const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3 });
//     if (photo) 
//         setPhotoUri(photo.uri);
//   };

//   const handleConfirm = () => {
//     dispatch(addPitcure(photoUri));
//     const formData = new FormData(); //initialisation formData
//       formData.append("photoFromFront", {
//         //création de la boite à envoyer au back
//         uri: photo.uri,
//         name: "photo.jpg",
//         type: "image/jpeg",
//       });
//       fetch(`${EXPO_PUBLIC_BACKEND_URL}/upload`, {
//         //envoi dans le back
//         method: "POST",
//         body: formData,
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           photo && dispatch(addPhoto(data.uri));
//         });
//     navigation.navigate("PlayerLobby");
//   };

//   if (!hasPermission || !isFocused) return <View />;

//   if (photoUri) {
//     return (
//       <View style={styles.previewContainer}>
//         <Image source={{ uri: photoUri }} style={styles.previewImage} />
//         <View style={styles.buttonRow}>
//           <Button title="Reprendre" onPress={() => setPhotoUri(null)} />
//           <Button title="Confirmer" onPress={handleConfirm} />
//         </View>
//       </View>
//     );
//   }

//   return (
//     <ImageBackground style={styles.overlay}>
//       <View style={styles.delimiter} />
//       <View style={styles.centerContainer}>
//         <CameraView
//           style={styles.camera}
//           facing="front"
//           ref={(ref) => (cameraRef.current = ref)}
//           zoom={0.2}
//         />
//       </View>
//       <View style={styles.delimiter}>
//         <Pressable
//           onPress={takePicture}
//           style={({ pressed }) => [
//             { opacity: pressed ? 0.6 : 1 },
//             styles.button,
//           ]}
//         >
//           <FontAwesome name="circle-thin" size={100} />
//         </Pressable>
//       </View>
//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     paddingVertical: 20,
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   delimiter: {
//     width: "100%",
//     height: 100,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   centerContainer: {
//     width: FRAME_SIZE,
//     height: FRAME_SIZE * 1.3,
//     borderRadius: FRAME_SIZE * 0.65,
//     overflow: "hidden",
//   },
//   camera: {
//     width: "100%",
//     height: "100%",
//   },
//   button: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   previewContainer: {
//     flex: 1,
//     backgroundColor: "#000",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   previewImage: {
//     width: "90%",
//     height: "70%",
//     borderRadius: 20,
//     marginBottom: 20,
//   },
//   buttonRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     width: "80%",
//   },
// });
