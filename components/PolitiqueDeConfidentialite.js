import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";

export const PolitiqueDeConfidentialite = ({ visible, hide }) => {
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
              <Text style={styles.textButton}>X</Text>
            </TouchableOpacity>
          </View>
<Text style={styles.textPolitiqueModal}>
  Bienvenue dans FaceParty !{"\n\n"}
  Nous attachons une grande importance à la confidentialité et à la protection
  des données de nos utilisateurs. Voici les principes que nous appliquons :{"\n\n"}

  <Text style={{ fontWeight: "bold" }}>
    Aucune donnée personnelle collectée
  </Text>
  {"\n"}
  FaceParty ne vous demande pas de créer un compte, de fournir votre nom,
  votre adresse e-mail ou toute autre information personnelle.{"\n\n"}

  <Text style={{ fontWeight: "bold"}}>
    Aucune conservation des photos de visage
  </Text>
  {"\n"}
  Les photos prises lors de l’utilisation de FaceParty (notamment pour générer des visages morphés)
  sont utilisées temporairement. Elles ne sont pas conservées après nos traitements de morphing.{"\n\n"}

  <Text style={{ fontWeight: "bold"}}>
    Suppression automatique
  </Text>
  {"\n"}
  Un mécanisme spécifique est en place pour garantir la suppression des photos utilisées.
  Cette suppression est contrôlée pour assurer une confidentialité totale de chaque session de jeu.{"\n\n"}

  <Text style={{ fontWeight: "bold"}}>
    Un jeu privé et respectueux
  </Text>
  {"\n"}
  FaceParty a été conçu pour être joué entre amis et proches, sans aucune exposition publique
  des images générées, sauf si vous choisissez délibérément de les partager.{"\n\n"}

  En utilisant FaceParty, vous acceptez ces conditions et profitez d’un jeu fun, surprenant,
  et respectueux de votre vie privée.{"\n\n"}
  Bonne partie 🎉
</Text>
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
    margin: 20,
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
  // modalCross: {
  //   justifyContent: "center",
  //   alignItems: "center",
  //   width: "100%",
  // },
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
  textPolitiqueModal: {
    fontSize: 10,
    lineHeight: 15,
    color: "#333",
    textAlign: "left",
  },
});
