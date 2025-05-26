import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // https://oblador.github.io/react-native-vector-icons/#FontAwesome

import Home from "./screens/Home";
import HomeTuto from "./screens/HomeTuto";
import HomePlayer from "./screens/HomePlayer";
import Question from "./screens/Question";
import GameLifeScreen from "./screens/GameLifeScreen";
import PlayerName from "./screens/PlayerName";
import PlayerLobby from "./screens/PlayerLobby";
// Multi game screens
import HomeMulti from "./screens/HomeMulti";
import NewMultiGame from "./screens/NewMultiGame";
import JoinMultiGame from "./screens/JoinMultiGame";
import SnapScreen from "./screens/SnapScreen";
// import StartSound from "./screens/StartSound";
import Start from "./screens/Start";
import ScoreBoard from "./screens/ScoreBoard";

import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist"; // Persistor
import { PersistGate } from "redux-persist/integration/react";
import { SocketProvider } from "./contexts/SocketContext";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage

import game from "./reducers/game";
import player from "./reducers/player";
import question from "./reducers/question";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case "HomeAdmin":
              return <FontAwesome name={"home"} size={size} color={color} />;
            case "HomePlayer":
              return <FontAwesome name={"user"} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: "#2196f3",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomePlayer" component={HomePlayer} />
    </Tab.Navigator>
  );
};

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
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="HomeTuto" component={HomeTuto} />
              <Stack.Screen name="PlayerName" component={PlayerName} />
              <Stack.Screen name="SnapScreen" component={SnapScreen} />
              <Stack.Screen name="PlayerLobby" component={PlayerLobby} />
              <Stack.Screen name="TabNavigator" component={TabNavigator} />
              <Stack.Screen name="Question" component={Question} />
              <Stack.Screen name="GameLifeScreen" component={GameLifeScreen} />

              {/* Multi game admin and lobby screens */}
              <Stack.Screen name="HomeMulti" component={HomeMulti} />
              <Stack.Screen name="NewMultiGame" component={NewMultiGame} />
              <Stack.Screen name="JoinMultiGame" component={JoinMultiGame} />
              <Stack.Screen name="Start" component={Start} />
              <Stack.Screen name="ScoreBoard" component={ScoreBoard} />
            </Stack.Navigator>
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </SocketProvider>
  );
}
