import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";

// Load context and State managers
import { useState, useEffect } from "react";


export const PolitiqueDeConfidentialite = ({
  visible,
  hide,
}) => {

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalCross}>
            <TouchableOpacity
              onPress={() => hide()}
              style={styles.crossModal}
              activeOpacity={0.8}
            >
              <Text style={styles.textButton}>testtest</Text>
            </TouchableOpacity>
          </View>
          <Text>Politique de confidentialité ici......</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalCross: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "",
    width: "100%",
  },
  crossModal: {
    width: 30,
    height: 30,
    borderRadius: 15,
    paddingTop: 5,
    backgroundColor: "#de6b58",
    alignItems: "center",
    justifyContent: "center",
    marginTop: -10,
    marginBottom: 15,
  },
  textButton: {
    color: "#ffffff",
    height: 24,
    fontWeight: "600",
    fontSize: 15,
  },
  image: {
    width: 150,
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: "center",
    marginRight: -20,
  },
  blockChangeImg: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  icon: {
    marginLeft: -5,
    marginTop: 10,
  },
  input: {
    width: 200,
    borderBottomColor: "#de6b58",
    borderBottomWidth: 1,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    width: 200,
    alignItems: "center",
    marginTop: 20,
    paddingTop: 8,
    backgroundColor: "#de6b58",
    borderRadius: 10,
  },
});
