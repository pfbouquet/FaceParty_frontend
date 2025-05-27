import { StyleSheet, View, Button, Text } from "react-native";

import { useEffect, useState } from "react";
import { CameraView, Camera } from "expo-camera";

export const JoinQRScanner = ({ onScanned, onCancel }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false); // State to make sure that the scanner stops once a code is scanned

  useEffect(() => {
    (async () => {
      const result = await Camera.requestCameraPermissionsAsync();
      setHasPermission(result && result?.status === "granted");
    })();
  }, []);

  function barCodeScanned(res) {
    if (scanned) return; // Prevents re-execution
    setScanned(true);
    console.log("BarCode scanned: ", res.data);
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
        onBarcodeScanned={(res) => barCodeScanned(res)}
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
