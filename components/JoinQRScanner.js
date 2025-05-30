import { StyleSheet, View, Button, Text } from "react-native";
import { useEffect, useState, useRef } from "react";
import { CameraView, Camera } from "expo-camera";

const SCAN_INTERVAL_MS = 1000; // 1 scan max par seconde

export const JoinQRScanner = ({ onScanned, onCancel }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const lastScanTimeRef = useRef(0); // horodatage du dernier scan traité

  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result.status === "granted");
    })();
  }, []);

  function handleBarCodeScanned(res) {
    const now = Date.now();
    if (now - lastScanTimeRef.current < SCAN_INTERVAL_MS) {
      return; // Ignore le scan, trop proche du précédent
    }

    lastScanTimeRef.current = now;
    console.log("📷 QR scanné (cadencé):", res.data);
    onScanned(res.data);
  }

  if (hasPermission === null) {
    return <Text>Demande de permission…</Text>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text>Accès caméra refusé.</Text>
        <Button title="Annuler" onPress={onCancel} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={(res) => handleBarCodeScanned(res)}
      ></CameraView>
      <Button title="Annuler" onPress={onCancel} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: "80%",
    height: "50%",
  },
});
