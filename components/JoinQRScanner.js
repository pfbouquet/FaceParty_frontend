// Scan du QR Code pour rejoindre la partie (dans screen JoinMultiGame)
import { StyleSheet, View, Button, Text } from "react-native";
import { useEffect, useState, useRef } from "react";
import { CameraView, Camera } from "expo-camera";

const SCAN_INTERVAL_MS = 1000; // 1 scan max par seconde

export const JoinQRScanner = ({ onScanned, onCancel }) => {
  const [hasPermission, setHasPermission] = useState(false); // permission accès caméra
  const lastScanTimeRef = useRef(0); // horodatage du dernier scan effectué

  // Demande de permission caméra au montage du composant
  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result.status === "granted");
    })();
  }, []);

  // Fonction appelée à chaque scan de code barre
  function handleBarCodeScanned(res) {
    const now = Date.now();
    // Ignore le scan, trop proche du précédent
    if (now - lastScanTimeRef.current < SCAN_INTERVAL_MS) {
      return;
    }
    // Sinon, on valide ce scan
    lastScanTimeRef.current = now;
    console.log("📷 QR scanné (cadencé):", res.data);
    onScanned(res.data); // transmet la donnée scannée au parent
  }

  // Cas où la permission caméra est en attente
  if (hasPermission === null) {
    return <Text>Demande de permission…</Text>;
  }
  // Cas où la permission est refusée
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
