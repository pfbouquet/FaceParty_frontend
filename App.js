// Importations principales pour navigation, icônes, gestion clavier et Redux
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { KeyboardAvoidingWrapper } from "./components/KeyboardAvoidingWrapper";

// Import des écrans (player, multi, photo, podium, etc.)
import GameLifeScreen from "./screens/GameLifeScreen";
import PlayerName from "./screens/PlayerName";
import PlayerLobby from "./screens/PlayerLobby";
// Multi game screens
import HomeMulti from "./screens/HomeMulti";
import NewMultiGame from "./screens/NewMultiGame";
import JoinMultiGame from "./screens/JoinMultiGame";
import SnapScreen from "./screens/SnapScreen";
import Podium from "./screens/Podium";

// Redux, persist et contexte socket
import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist"; // Persistor
import { PersistGate } from "redux-persist/integration/react";
import { SocketProvider } from "./contexts/SocketContext";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage

// Reducers redux
import game from "./reducers/game";
import player from "./reducers/player";
import question from "./reducers/question";

const Stack = createNativeStackNavigator();

// Redux Persist Configuration
const persistedReducers = persistReducer(
  {
    key: "expojs-starter",
    storage: AsyncStorage,
    blacklist: [], // Add reducers that you don't want to persist
    whitelist: ["player", "game", "question"], // Add reducers that you want to persist
  },
  combineReducers({ player, game, question })
);

const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

export default function App() {
  return (
    <SocketProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <KeyboardAvoidingWrapper>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="HomeMulti" component={HomeMulti} />
                {/* Multi game admin and lobby screens */}
                <Stack.Screen name="NewMultiGame" component={NewMultiGame} />
                <Stack.Screen name="JoinMultiGame" component={JoinMultiGame} />
                <Stack.Screen name="PlayerLobby" component={PlayerLobby} />
                {/* Edition screen (player name and portrait) */}
                <Stack.Screen name="PlayerName" component={PlayerName} />
                <Stack.Screen name="SnapScreen" component={SnapScreen} />
                {/* Game screens */}
                <Stack.Screen
                  name="GameLifeScreen"
                  component={GameLifeScreen}
                />
                <Stack.Screen name="Podium" component={Podium} />
              </Stack.Navigator>
            </NavigationContainer>
          </KeyboardAvoidingWrapper>
        </PersistGate>
      </Provider>
    </SocketProvider>
  );
}
