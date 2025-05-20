import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // https://oblador.github.io/react-native-vector-icons/#FontAwesome

import Home from "./screens/Home";
import HomeTuto from "./screens/HomeTuto";
import HomeAdmin from "./screens/HomeAdmin";
import HomePlayer from "./screens/HomePlayer";

import { Provider } from "react-redux";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist"; // Persistor
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage

import user from "./reducers/user";

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
			<Tab.Screen name="HomeAdmin" component={HomeAdmin} />
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
		whitelist: ["user"], // Add reducers that you want to persist
	},
	combineReducers({ user })
);

const store = configureStore({
	reducer: persistedReducers,
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);

export default function App() {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<NavigationContainer>
					<Stack.Navigator screenOptions={{ headerShown: false }}>
						<Stack.Screen name="Home" component={Home} />
						<Stack.Screen name="HomeTuto" component={HomeTuto} />
						<Stack.Screen name="TabNavigator" component={TabNavigator} />
					</Stack.Navigator>
				</NavigationContainer>
			</PersistGate>
		</Provider>
	);
}
