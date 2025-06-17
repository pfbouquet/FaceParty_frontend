# FaceParty Mobile (Frontend)

<img src="./assets/logo-faceparty.png" width="300" alt="FaceParty Logo" />

## Table des matières

- [FaceParty Mobile (Frontend)](#faceparty-mobile-frontend)
  - [Table des matières](#table-des-matières)
  - [Description](#description)
  - [Fonctionnalités](#fonctionnalités)
  - [Prérequis pour le développement](#prérequis-pour-le-développement)
  - [Installation pour le développement](#installation-pour-le-développement)
  - [Lancement](#lancement)
  - [Structure du projet](#structure-du-projet)
  - [Technologies](#technologies)
  - [Licence](#licence)

## Description

FaceParty est un party‑game mobile multijoueur basé sur la reconnaissance et le morphing de visages.  
Les joueurs prennent un selfie, puis la partie s'éxécute en plusieurs tours. A chaque tour, le backend génère un morph entre les visages des joueurs et propose un QCM pour deviner qui se cache derrière l’image transformée.

- Frontend: github.com/pfbouquet/FaceParty_frontend
- Backend: github.com/pfbouquet/FaceParty_backend
- Morphing API: github.com/pfbouquet/FaceParty_morpher

## Fonctionnalités

- Création et gestion de parties multijoueurs via un code de salle (roomID)
- Selfie & modification de photo
- Quiz synchronisé en temps réel (Socket.io)
- Classement et podium
- Mode “Solo” avec célébrités pré‑enregistrées

## Prérequis pour le développement

- Node.js
- Yarn ou npm
- Expo CLI (`npm install -g expo-cli`)

## Installation pour le développement

```bash
git clone https://github.com/pfbouquet/FaceParty_frontend.git
cd FaceParty_frontend
yarn install       # ou `npm install`
```

Créez un fichier .env.local contenant les variables d'environement suivantes:

```
EXPO_PUBLIC_BACKEND_URL=https://your-bakend-run-ip-or-url:port #exemple
```

## Lancement

```bash
yarn start
```

## Structure du projet

```bash
FaceParty_frontend/
├── .github/workflows/  # github action pour la CI/CD
├── assets/             # Images, logos, icônes
├── components/         # Composants réutilisables
├── screens/            # Écrans (Home, Lobby, Game, Score, Podium…)
├── reducers/           # Reducers, qui gère les maintiennet les états communs
├── contexts/           # Context provider nécessaire dans toute l'application (Socket par exemple)
├── App.js
├── app.json
└── package.json
```

## Technologies

- React Native & Expo
- Redux Toolkit
- Socket.io-client
- ES6+, Hooks & Functional Components

## Licence

MIT © Aymeric Simao; Thomas Lecoeur; Pierre‑François Bouquet
